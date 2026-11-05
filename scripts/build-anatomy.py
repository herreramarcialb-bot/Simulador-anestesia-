#!/usr/bin/env python3
"""Rebuild the local GLB from immutable BodyParts3D 3.0 STL assets.
No primitive anatomy, resculpting, decimation, or relative repositioning.
Python standard library only. Run from the repository root.
"""
import concurrent.futures, hashlib, json, math, pathlib, struct, urllib.request
ROOT = pathlib.Path(__file__).resolve().parents[1]
OUT = ROOT / 'public/models/bodyparts3d'
CACHE = pathlib.Path('/tmp/dental-bodyparts3d-3.0')
COMMIT = 'f0eeb6e843380cfe6b83797cf8c3e1af74de5e61'
BASE = f'https://raw.githubusercontent.com/Kevin-Mattheus-Moerman/BodyParts3D/{COMMIT}/assets/BodyParts3D_data/'
BONES = {'skull':[52734,52735,52736,52740,9710,52738,52739,52788,52789,52892,52893,53647,53648,53655,53656,53645,53646,54737,54738], 'maxilla':[53649,53650], 'mandible':[52748]}
TEETH = [55680,55681,55682,55683,55686,55687,55688,55689,55690,55691,55692,55693,55694,55695,55697,55698,55699,55700,55703,55704,55705,55706,55798,55799,57140,57141,57142,57143]
PARTS = [(group, f'FMA{i}') for group,ids in {**BONES, 'teeth':TEETH}.items() for i in ids]
MANIFEST_PATH = OUT / 'manifest.json'
EXPECTED = {p['fma']: p['sha256'] for p in json.loads(MANIFEST_PATH.read_text())['parts']} if MANIFEST_PATH.exists() else {}

def obtain(item):
 group,fma=item; path=f'stl/{fma}.stl'; cached=CACHE/f'{fma}.stl'
 if cached.exists(): data=cached.read_bytes()
 else:
  data=urllib.request.urlopen(BASE+path,timeout=60).read();cached.write_bytes(data)
 if fma in EXPECTED and hashlib.sha256(data).hexdigest() != EXPECTED[fma]:
  raise ValueError(f'Source checksum mismatch: {fma}; refusing to replace verified geometry')
 count=struct.unpack_from('<I',data,80)[0]
 if len(data)!=84+50*count or count==0:raise ValueError(f'Invalid STL: {fma}')
 return group,fma,data,count

def build():
 OUT.mkdir(parents=True,exist_ok=True);CACHE.mkdir(parents=True,exist_ok=True)
 names=urllib.request.urlopen(BASE+'parts_list_e.txt',timeout=30).read()
 (OUT/'source-parts-list.txt').write_bytes(names)
 nameMap=dict(l.split('\t',1) for l in names.decode().splitlines() if '\t' in l)
 license=urllib.request.urlopen(BASE+'LICENSE_content',timeout=30).read();(OUT/'LICENSE.txt').write_bytes(license)
 with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool: assets=list(pool.map(obtain,PARTS))
 blob=bytearray(); views=[];accessors=[];meshes=[];nodes=[];manifest=[]
 def buffer(data,target):
  while len(blob)%4:blob.append(0)
  i=len(views);views.append({'buffer':0,'byteOffset':len(blob),'byteLength':len(data),'target':target});blob.extend(data);return i
 def accessor(data,kind,ctype,count,target,**extra):
  i=len(accessors);accessors.append({'bufferView':buffer(data,target),'componentType':ctype,'count':count,'type':kind,**extra});return i
 for group,fma,data,count in assets:
  vertices=[];faces=[];lookup={}
  for i in range(count):
   v=struct.unpack_from('<12f',data,84+50*i);face=[]
   for j in [3,6,9]:
    # STL coordinate convention is X left/right, Y posterior/anterior, Z superior.
    p=(v[j],v[j+2],-v[j+1])
    if p not in lookup:lookup[p]=len(vertices);vertices.append(p)
    face.append(lookup[p])
   faces.extend(face)
  normals=[[0.,0.,0.] for _ in vertices]
  for a,b,c in zip(faces[::3],faces[1::3],faces[2::3]):
   u=[vertices[b][k]-vertices[a][k] for k in range(3)];v=[vertices[c][k]-vertices[a][k] for k in range(3)]
   n=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]]
   for k in [a,b,c]:
    for d in range(3):normals[k][d]+=n[d]
  normals=[tuple(x/(math.sqrt(sum(v*v for v in n)) or 1) for x in n) for n in normals]
  pack=lambda seq:struct.pack('<'+'f'*len(seq),*seq)
  lo=[min(v[k] for v in vertices) for k in range(3)];hi=[max(v[k] for v in vertices) for k in range(3)]
  pos=accessor(pack([x for v in vertices for x in v]),'VEC3',5126,len(vertices),34962,min=lo,max=hi)
  norm=accessor(pack([x for v in normals for x in v]),'VEC3',5126,len(normals),34962)
  idx=accessor(struct.pack('<'+'I'*len(faces),*faces),'SCALAR',5125,len(faces),34963)
  name=f'{group}_{fma}';meshes.append({'name':name,'primitives':[{'attributes':{'POSITION':pos,'NORMAL':norm},'indices':idx}]});nodes.append({'name':name,'mesh':len(meshes)-1,'extras':{'anatomyKey':group,'fma':fma,'sourceName':nameMap[fma]}})
  manifest.append({'file':fma+'.stl','group':group,'fma':fma,'name':nameMap[fma],'sourceUrl':BASE+f'stl/{fma}.stl','sha256':hashlib.sha256(data).hexdigest(),'triangles':count,'bounds':[lo,hi]})
  print(f'{fma}: {nameMap[fma]} — {count} triangles')
 doc={'asset':{'version':'2.0','generator':'Dental Anesthesia 3D / build-anatomy.py','copyright':'BodyParts3D, © Database Center for Life Science, CC BY-SA 2.1 Japan'},'scene':0,'scenes':[{'nodes':list(range(len(nodes)))}],'nodes':nodes,'meshes':meshes,'buffers':[{'byteLength':len(blob)}],'bufferViews':views,'accessors':accessors}
 js=json.dumps(doc,separators=(',',':')).encode();js+=b' '*((-len(js))%4);blob+=b'\0'*((-len(blob))%4)
 glb=struct.pack('<III',0x46546c67,2,28+len(js)+len(blob))+struct.pack('<II',len(js),0x4e4f534a)+js+struct.pack('<II',len(blob),0x004e4942)+blob
 (OUT/'craniofacial.glb').write_bytes(glb)
 m={'dataset':'BodyParts3D 3.0 (20110915)','mirrorCommit':COMMIT,'license':'CC BY-SA 2.1 Japan','licenseUrl':'https://creativecommons.org/licenses/by-sa/2.1/jp/','adaptation':'STL to indexed GLB; area-weighted vertex normals; rigid axis conversion (x,y,z) → (x,z,-y). No decimation or relative repositioning. Runtime applies one uniform scale and common translation.','glbSha256':hashlib.sha256(glb).hexdigest(),'parts':manifest}
 (OUT/'manifest.json').write_text(json.dumps(m,indent=2)+'\n')
 print('GLB bytes',len(glb),'triangles',sum(x['triangles'] for x in manifest))
if __name__=='__main__':build()
