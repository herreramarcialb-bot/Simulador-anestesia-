# Anatomical meshes — attribution and redistribution

**BodyParts3D, (c) The Database Center for Life Science licensed under CC Attribution-Share Alike 2.1 Japan.**

Original upstream credit: “BodyParts3D, Copyrightc 2008 Life Science Integrated Database Center licensed by CC Display-Inheritance 2.1 Japan”.

- Dataset: **BodyParts3D / Anatomography 3.0, 20110915**, adult male reference.
- Creator: Database Center for Life Science (DBCLS), Japan.
- Source project: http://lifesciencedb.jp/bp3d/
- Official archive: https://dbarchive.biosciencedbc.jp/en/bodyparts3d/desc.html
- Archive identifier: https://doi.org/10.18908/lsdba.nbdc00837-000
- Download mirror: https://github.com/Kevin-Mattheus-Moerman/BodyParts3D
- Immutable mirror revision: `f0eeb6e843380cfe6b83797cf8c3e1af74de5e61`.
- Mirror directory: `assets/BodyParts3D_data/stl/`.
- License: **Creative Commons Attribution-ShareAlike 2.1 Japan**, https://creativecommons.org/licenses/by-sa/2.1/jp/ (English deed: https://creativecommons.org/licenses/by-sa/2.1/jp/deed.en).
- Upstream license notice is retained verbatim in `LICENSE.txt`.

These meshes may be used and redistributed in this educational application with attribution and compliance with the share-alike license. Adapted geometry and rendered images derived from it remain subject to that license. The mesh license is distinct from licenses of application code and dependencies. No endorsement by DBCLS or the mirror maintainer is implied.

## Included anatomy

`craniofacial.glb` contains **50 named anatomical meshes**, **441,936 triangles**:

- 19 cranial/facial bones: frontal, occipital, sphenoid, ethmoid, vomer, paired temporal, parietal, zygomatic, nasal, palatine, lacrimal and inferior nasal conchae.
- 2 maxillae and 1 mandible.
- 28 permanent teeth, individually identified. **Third molars are absent from the source subset; they have not been invented or duplicated.**

Original English names, FMA identifiers, source URLs, source STL SHA-256 hashes, triangle counts and bounds are retained in `manifest.json`. The upstream name table is retained in `source-parts-list.txt`.

## Adaptations in this application

The mirror converts upstream OBJ meshes to binary STL. This application converts the STL triangle surfaces to an indexed **GLB 2.0**, welds vertices with exactly identical positions and computes area-weighted vertex normals. It converts axes rigidly from source `(x, y, z)` to viewer `(x, z, -y)`. Runtime applies the **same uniform scale and translation to every anatomical part**. No bones or teeth are sculpted from primitives, rescaled independently, decimated, or repositioned relative to one another. Materials and studio lighting are applied for inspection; no photographic or diagnostic textures are claimed.

Run `python3 scripts/build-anatomy.py` from the repository root to reproduce the model using the Python standard library and verified TLS. Source assets are cached outside the checkout under `/tmp/dental-bodyparts3d-3.0`. The checked-in GLB is served locally; users do not need network access to anatomical libraries at runtime.

## Nerves and limitations

The downloaded 3.0 collection does **not** supply verified inferior alveolar nerve meshes. The original atlas meshes remain unchanged. A newer 4.3 mirror identifies the two trunks (FMA80518/FMA80519), but actual compatible LFS meshes could not be retrieved and verified in this environment.

At the user's explicit request, a separate educational module now adds **hand-authored schematic nerve paths and conceptual soft-tissue territory surfaces**. These are original application illustrations, **not DBCLS anatomical meshes**, not extracted from this dataset, and not claimed to have clinical spatial accuracy. They are labeled as approximations throughout the application. See `../../neuro-references.md` for scope and conceptual references. The BodyParts3D license and attribution continue to apply to the original and adapted atlas geometry and images.

This is a detailed reference atlas, not a patient-specific scan or a validated dental anesthesia planning device. Human variation, small foramina, the mandibular canal and soft tissues may be incompletely represented by this source. The virtual syringe is an original illustrative instrument model, **not** a clinical device model from DBCLS; its dimensions are not calibrated for procedural guidance. No injection target is certified.

## Citation

Mitsuhashi N, Fujieda K, Tamura T, Kawamoto S, Takagi T, Okubo K. _BodyParts3D: 3D structure database for anatomical concepts._ Nucleic Acids Research. 2009;37(Database issue):D782–D785. https://doi.org/10.1093/nar/gkn613
