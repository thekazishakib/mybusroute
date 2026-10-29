# Data report

## Source

Bus routes and stops come from the "Local Bus" page on dhakatc.com. The page was saved as a 91-page PDF made of images with no text layer, so the text was read with OCR. All 176 bus names were then checked by eye against the page images.

## Numbers

- Buses: 176
- Unique stops after cleaning: 273
- Bus-stop rows: 3,513

Buses that share a name are numbered in the order they appear in the source (for example Alif Bus 1 to 4, BRTC Bus 1 to 9).

## Known problems

1. **Missing lines.** The phone layout cut off a few lines at the bottom of each PDF page. 80 buses have at least one gap, so some of their stops, and in rare cases a whole bus, may be missing. The `page_gaps` column in `tables/buses.csv` and the `check` column in `tables/bus_stops.csv` mark the affected rows.
2. **OCR spelling.** 58 stop names appear only once and may contain OCR errors. They are flagged in the `check` column of `tables/stop_to_buses.csv`.
3. **Missing Bengali bus names.** Four buses have no Bengali name because it was hidden behind the phone menu bar in the PDF: B049 City Link Bus, B081 J M Super Paribahan, B122 Purbachol Logistics and Transport, B139 Shadhin Express.
4. **No fares in the source.** `fares.json` is empty. Fares shown on the site are estimated by the app from route distance (see `src/data/fare.ts`).
5. **No travel times.** The source has none, so the app does not show any. A few buses list operating hours, but only in the CSV tables, not in the JSON.
6. **English stop names only.** The source has no Bengali stop names. The site spells some stops in several ways, and the obvious variants were merged (see the list below).
7. **Direction.** The source marks every bus as running both ways, so all buses are treated that way.

## Landmark hints

Dhaka University is not a stop name in the data, so `curated/landmarks.json` maps landmarks like it to nearby stops. These mappings are suggestions and do not come from the source data.

## Spelling and OCR fixes

Raw text on the left, cleaned name on the right. A `+` means the raw text held two stops that were split apart.

- `Shvyamoli  ->  Shyamoli`
- `Sony Hall  ->  Sony Cinema Hall`
- `Press Club 2 Hiah  ->  Press Club + Hiah`
- `Aminbazar  ->  Amin Bazar`
- `Asad gate  ->  Asad Gate`
- `Malibagh Railaate 2  ->  Malibagh Railgate`
- `Shantinaaar  ->  Shantinagar`
- `Sony Cenema Hall  ->  Sony Cinema Hall`
- `Konabari 2 Ruonagar 2  ->  Konabari + Rupnagar`
- `Shia Mosque  ->  Shia Masjid`
- `kakali  ->  Kakali`
- `Kalabagan City College  ->  Kalabagan + City College`
- `Dhanmondi 32 Kalabagan  ->  Dhanmondi 32 + Kalabagan`
- `Dainik Ranala  ->  Dainik Bangla Moor`
- `Kamlapur  ->  Kamalapur`
- `Bangla Motor Shahbag  ->  Bangla Motor + Shahbag`
- `Savedabad 2  ->  Sayedabad`
- `Kalshi Pallabi  ->  Kalshi + Pallabi`
- `Nobinagar Chandra  ->  Nobinagar + Chandra`
- `Colleae Gate 2  ->  College Gate`
- `Kawran Bazar 2  ->  Kawran Bazar`
- `Jamuna Future  ->  Jamuna Future Park`
- `Shukrabad Kalabagan  ->  Shukrabad + Kalabagan`
- `Kolabagan  ->  Kalabagan`
- `Panthopoth  ->  Panthapath`
- `Karwan Bazar  ->  Kawran Bazar`
- `Kuril Bissho Road  ->  Kuril Bishwa Road`
- `Paltan 2~ GPO 2  ->  Paltan + GPO`
- `Rajlakshmi House Building  ->  Rajlakshmi + House Building`
- `Khamar Bari Farmgate  ->  Khamar Bari + Farmgate`
- `Motso Vobon  ->  Matsya Bhaban`
- `Malibagg Mor  ->  Malibagh Moor`
- `Malibagh Rail Gate  ->  Malibagh Railgate`
- `Natun Bazar  ->  Notun Bazar`
- `Hazivara 2  ->  Hazipara`
- `Mirpur Sony Cinema Hall  ->  Mirpur 1 + Sony Cinema Hall`
- `Farmgate Bijoy Sarani  ->  Farmgate + Bijoy Sarani`
- `Purobi Pallabi  ->  Purobi + Pallabi`
- `Mogbazar Mohakhali  ->  Mogbazar + Mohakhali`
- `Sony Cinema Hall Mirpur 1  ->  Sony Cinema Hall + Mirpur 1`
- `Nobinagar Baipayl  ->  Nobinagar + Baipayl`
- `Airport Jashimuddin (Uttara)  ->  Airport + Jashimuddin (Uttara)`
- `Chairman Bari 2  ->  Chairman Bari`
- `Dainik Bangla  ->  Dainik Bangla Moor`
- `Shanir Akhra  ->  Shonir Akhra`
- `Kazipara Shewrapara  ->  Kazipara + Shewrapara`
- `New Market Nilkhet  ->  New Market + Nilkhet`
- `Kawran Bazarz 2  ->  Kawran Bazar`
- `Sony Cinema Hall 2 Mirour 2  ->  Sony Cinema Hall + Mirpur 2`
- `Mohakhali 2  ->  Mohakhali`
- `Mirpur 2 Mirpur 10  ->  Mirpur 2 + Mirpur 10`
- `Vashantek 2  ->  Vashantek`
- `Shankar 2  ->  Shankar`
- `Mirour 22  ->  Mirpur 2`
- `Sadarahat 2  ->  Sadarghat`
- `Mirour 12  ->  Mirpur 1`
- `Ittefagq Moor  ->  Ittefaq Moor`
- `Paltan 2 GPO 2  ->  Paltan + GPO`
- `Dhanmondi 27 2  ->  Dhanmondi 27`
- `Shahiadpur 2  ->  Shahjadpur`
- `Sayedabad Janapath Moor  ->  Sayedabad + Janapath Moor`
- `Ring road  ->  Ring Road`
- `Adabor Shyamoli  ->  Adabor + Shyamoli`
- `Matsva Bhaban  ->  Matsya Bhaban`
- `Nava Bazarz 2  ->  Naya Bazar`
- `Sadarahat  ->  Sadarghat`
- `Mirpur 12 MPT GIANTS at  ->  Mirpur 12`