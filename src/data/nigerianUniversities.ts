export interface UniversitySeed {
  name: string;
  short_name: string;
  city: string;
  state: string;
  type: 'Federal' | 'State' | 'Private';
  student_count: number;
  logo_url: string;
  lat: number;
  lng: number;
  campuses: Array<{
    name: string;
    campus_type: string;
    city: string;
    state: string;
    lat: number;
    lng: number;
    description: string;
  }>;
}

export const NIGERIAN_UNIVERSITIES: UniversitySeed[] = [
  // --- FEDERAL UNIVERSITIES ---
  {
    name: "Federal University of Technology, Minna",
    short_name: "FUTMINNA",
    city: "Minna",
    state: "Niger State",
    type: "Federal",
    student_count: 28000,
    logo_url: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=200&q=80",
    lat: 9.5312,
    lng: 6.4529,
    campuses: [
      { name: "Gidan Kwano Main Campus", campus_type: "Main Campus", city: "Minna", state: "Niger State", lat: 9.5312, lng: 6.4529, description: "Hostel Blocks A-D, SEET, SAAT, SICT, SUB Complex, Library" },
      { name: "Bosso Campus", campus_type: "Mini Campus", city: "Minna", state: "Niger State", lat: 9.6139, lng: 6.5463, description: "Bosso Gate, Science Quad, Halls 1 & 2, Clinical Clinics" },
      { name: "Off-Campus - Gidan Kwano Village Lodges", campus_type: "Student Lodge Zone", city: "Minna", state: "Niger State", lat: 9.5250, lng: 6.4600, description: "Popular private off-campus student lodges & apartments" },
      { name: "Off-Campus - Bosso Road / Central Minna", campus_type: "Student Residential Zone", city: "Minna", state: "Niger State", lat: 9.6050, lng: 6.5500, description: "Residential hostels along Bosso-Tunga transit corridor" }
    ]
  },
  {
    name: "University of Lagos",
    short_name: "UNILAG",
    city: "Akoka, Yaba",
    state: "Lagos State",
    type: "Federal",
    student_count: 55000,
    logo_url: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=200&q=80",
    lat: 6.5173,
    lng: 3.3976,
    campuses: [
      { name: "Akoka Main Campus", campus_type: "Main Campus", city: "Yaba, Lagos", state: "Lagos State", lat: 6.5173, lng: 3.3976, description: "New Hall, Moremi, Jaja, Faculty of Arts, Engineering, Law" },
      { name: "College of Medicine (CMUL) Idi-Araba", campus_type: "Medical Campus", city: "Surulere, Lagos", state: "Lagos State", lat: 6.5204, lng: 3.3592, description: "LUTH Idi-Araba medical hostels, dental clinic, anatomy labs" },
      { name: "Yaba Tech / Onike Student Corridor", campus_type: "Off-Campus Student Area", city: "Yaba, Lagos", state: "Lagos State", lat: 6.5100, lng: 3.3850, description: "Student accommodation, bookstores, printing presses, cafes" }
    ]
  },
  {
    name: "University of Abuja",
    short_name: "UniAbuja",
    city: "Airport Road / Gwagwalada",
    state: "FCT Abuja",
    type: "Federal",
    student_count: 36000,
    logo_url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=200&q=80",
    lat: 8.9754,
    lng: 7.1802,
    campuses: [
      { name: "Main Campus (Permanent Site)", campus_type: "Main Campus", city: "Airport Road, Abuja", state: "FCT Abuja", lat: 8.9754, lng: 7.1802, description: "Senate building, Male & Female Hostels, Faculty of Law, Social Sciences" },
      { name: "Mini Campus (Gwagwalada)", campus_type: "Mini Campus", city: "Gwagwalada", state: "FCT Abuja", lat: 8.9431, lng: 7.0858, description: "College of Health Sciences, UATH, Specialist Teaching Hospital" },
      { name: "Giri Junction Student Lodges", campus_type: "Off-Campus Zone", city: "Giri, Abuja", state: "FCT Abuja", lat: 8.9610, lng: 7.1420, description: "Affordable private self-contained lodges & student markets" }
    ]
  },
  {
    name: "University of Ibadan",
    short_name: "UI",
    city: "Ibadan",
    state: "Oyo State",
    type: "Federal",
    student_count: 38000,
    logo_url: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=200&q=80",
    lat: 7.4443,
    lng: 3.9003,
    campuses: [
      { name: "UI Main Campus", campus_type: "Main Campus", city: "Ibadan", state: "Oyo State", lat: 7.4443, lng: 3.9003, description: "Trenchard Hall, Mellanby, Tedder, Kuti, Queen Idia, Sultan Bello" },
      { name: "UCH College of Medicine (Alexander Brown)", campus_type: "Medical Campus", city: "Ibadan", state: "Oyo State", lat: 7.4042, lng: 3.9038, description: "Alexander Brown Hall (ABH), UCH Clinical wards" },
      { name: "Agbowo & Bodija Student Quarters", campus_type: "Off-Campus Zone", city: "Ibadan", state: "Oyo State", lat: 7.4480, lng: 3.9100, description: "Thriving commercial strip for tech repairs, textbooks & thrift" }
    ]
  },
  {
    name: "Obafemi Awolowo University",
    short_name: "OAU",
    city: "Ile-Ife",
    state: "Osun State",
    type: "Federal",
    student_count: 35000,
    logo_url: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&w=200&q=80",
    lat: 7.5186,
    lng: 4.5268,
    campuses: [
      { name: "Central Campus (OAU Ife)", campus_type: "Main Campus", city: "Ile-Ife", state: "Osun State", lat: 7.5186, lng: 4.5268, description: "Oduduwa Hall, Fajuyi, Awolowo, Angola, Mozambique, Moremi" },
      { name: "OAU Teaching Hospitals Complex", campus_type: "Medical Campus", city: "Ile-Ife", state: "Osun State", lat: 7.5020, lng: 4.5400, description: "Health sciences hostel, nursing wards, amphitheatre" },
      { name: "Mayfair & Asherifa Off-Campus", campus_type: "Off-Campus Zone", city: "Ile-Ife", state: "Osun State", lat: 7.5100, lng: 4.5150, description: "High student density private residences and eateries" }
    ]
  },
  {
    name: "Ahmadu Bello University",
    short_name: "ABU Zaria",
    city: "Zaria",
    state: "Kaduna State",
    type: "Federal",
    student_count: 52000,
    logo_url: "https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?auto=format&fit=crop&w=200&q=80",
    lat: 11.1528,
    lng: 7.6492,
    campuses: [
      { name: "Samaru Main Campus", campus_type: "Main Campus", city: "Samaru, Zaria", state: "Kaduna State", lat: 11.1528, lng: 7.6492, description: "Danfodio Hall, Izza Hall, Ribadu, Engineering, Agriculture" },
      { name: "Kongo Campus (Faculty of Law & Admin)", campus_type: "Law/Admin Campus", city: "Tudun Wada, Zaria", state: "Kaduna State", lat: 11.0850, lng: 7.7120, description: "Kongo Law Library, Business Administration, Accounting" }
    ]
  },
  {
    name: "University of Benin",
    short_name: "UNIBEN",
    city: "Benin City",
    state: "Edo State",
    type: "Federal",
    student_count: 42000,
    logo_url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=200&q=80",
    lat: 6.4022,
    lng: 5.6173,
    campuses: [
      { name: "Ugbowo Main Campus", campus_type: "Main Campus", city: "Benin City", state: "Edo State", lat: 6.4022, lng: 5.6173, description: "Hall 1, Hall 2, Hall 3, Engineering Complex, UBTH" },
      { name: "Ekenwan Campus", campus_type: "Arts & Education Campus", city: "Benin City", state: "Edo State", lat: 6.3240, lng: 5.5990, description: "Creative Arts, Performing Theatre, Education departments" }
    ]
  },
  {
    name: "University of Nigeria, Nsukka",
    short_name: "UNN",
    city: "Nsukka",
    state: "Enugu State",
    type: "Federal",
    student_count: 38000,
    logo_url: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=200&q=80",
    lat: 6.8645,
    lng: 7.4083,
    campuses: [
      { name: "Nsukka Main Campus", campus_type: "Main Campus", city: "Nsukka", state: "Enugu State", lat: 6.8645, lng: 7.4083, description: "Akpabio Hall, Bello, Balewa, Nnamdi Azikiwe Library" },
      { name: "Enugu Campus (UNEC)", campus_type: "Law, Business & Medicine", city: "Enugu", state: "Enugu State", lat: 6.4350, lng: 7.5020, description: "UNEC Campus, College of Medicine, Law, Management Sciences" }
    ]
  },
  {
    name: "Federal University of Technology, Owerri",
    short_name: "FUTO",
    city: "Owerri",
    state: "Imo State",
    type: "Federal",
    student_count: 27000,
    logo_url: "https://images.unsplash.com/photo-1525921429624-479b6a26d84d?auto=format&fit=crop&w=200&q=80",
    lat: 5.3883,
    lng: 7.0345,
    campuses: [
      { name: "Ihiagwa Main Campus", campus_type: "Main Campus", city: "Owerri", state: "Imo State", lat: 5.3883, lng: 7.0345, description: "SOET, SEET, SAAT, SICT, Hostel Blocks 1-4, FUTO Lake" },
      { name: "Eziobodo & Umuchima Student Lodges", campus_type: "Off-Campus Lodge Area", city: "Owerri", state: "Imo State", lat: 5.3780, lng: 7.0250, description: "Private off-campus hostels with fast campus shuttle access" }
    ]
  },
  {
    name: "University of Ilorin",
    short_name: "UniIlorin",
    city: "Ilorin",
    state: "Kwara State",
    type: "Federal",
    student_count: 48000,
    logo_url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=200&q=80",
    lat: 8.4799,
    lng: 4.6716,
    campuses: [
      { name: "Main Campus (Permanent Site)", campus_type: "Main Campus", city: "Ilorin", state: "Kwara State", lat: 8.4799, lng: 4.6716, description: "University Dam, Central Library, Faculty of Engineering, CIS, Law" },
      { name: "Mini Campus / UITH", campus_type: "College of Health Sciences", city: "Ilorin", state: "Kwara State", lat: 8.4950, lng: 4.5800, description: "Old Campus, University Teaching Hospital clinical hostels" }
    ]
  },
  {
    name: "University of Port Harcourt",
    short_name: "UniPort",
    city: "Port Harcourt",
    state: "Rivers State",
    type: "Federal",
    student_count: 40000,
    logo_url: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=200&q=80",
    lat: 4.9042,
    lng: 6.9242,
    campuses: [
      { name: "Choba Campus", campus_type: "Main Campus", city: "Port Harcourt", state: "Rivers State", lat: 4.9042, lng: 6.9242, description: "College of Health Sciences, Faculty of Pharmacy, Humanities" },
      { name: "Abuja Campus", campus_type: "Administrative/Science Campus", city: "Port Harcourt", state: "Rivers State", lat: 4.8970, lng: 6.9150, description: "Senate Building, Science & Management Sciences complexes" },
      { name: "Delta Campus", campus_type: "Engineering & Social Sciences", city: "Port Harcourt", state: "Rivers State", lat: 4.9120, lng: 6.9320, description: "Faculty of Engineering, Education, student residential halls" }
    ]
  },
  {
    name: "Federal University of Technology, Akure",
    short_name: "FUTA",
    city: "Akure",
    state: "Ondo State",
    type: "Federal",
    student_count: 24000,
    logo_url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=200&q=80",
    lat: 7.3034,
    lng: 5.1388,
    campuses: [
      { name: "Obanla Main Campus", campus_type: "Main Campus", city: "Akure", state: "Ondo State", lat: 7.3034, lng: 5.1388, description: "SEET, SAAT, School of Sciences, Main Library, Halls of Residence" },
      { name: "Obakekere Campus", campus_type: "Old Campus", city: "Akure", state: "Ondo State", lat: 7.2850, lng: 5.1520, description: "Applied Sciences laboratories, university guest house" }
    ]
  },
  {
    name: "Bayero University Kano",
    short_name: "BUK",
    city: "Kano",
    state: "Kano State",
    type: "Federal",
    student_count: 45000,
    logo_url: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=200&q=80",
    lat: 11.9772,
    lng: 8.4312,
    campuses: [
      { name: "New Campus (Gwarzo Road)", campus_type: "Main Campus", city: "Kano", state: "Kano State", lat: 11.9772, lng: 8.4312, description: "Faculties of Engineering, Law, Computer Science, Central Admin" },
      { name: "Old Campus (Kano City)", campus_type: "City Campus", city: "Kano", state: "Kano State", lat: 11.9920, lng: 8.4890, description: "School of Medicine, College of Health Sciences, AKTH" }
    ]
  },

  // --- STATE UNIVERSITIES ---
  {
    name: "Lagos State University",
    short_name: "LASU",
    city: "Ojo, Lagos",
    state: "Lagos State",
    type: "State",
    student_count: 35000,
    logo_url: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=200&q=80",
    lat: 6.4674,
    lng: 3.2014,
    campuses: [
      { name: "Ojo Main Campus", campus_type: "Main Campus", city: "Ojo, Lagos", state: "Lagos State", lat: 6.4674, lng: 3.2014, description: "Buba Marwa Auditorium, Law, Arts, Social Sciences, Science, Senate" },
      { name: "Epe Campus (Engineering & Agriculture)", campus_type: "Engineering Campus", city: "Epe, Lagos", state: "Lagos State", lat: 6.5840, lng: 3.9830, description: "Faculty of Engineering & School of Agriculture hostels" },
      { name: "LASUCOM Ikeja (College of Medicine)", campus_type: "Medical Campus", city: "Ikeja, Lagos", state: "Lagos State", lat: 6.5980, lng: 3.3520, description: "LASUTH teaching hospital complex & medical students lodge" }
    ]
  },
  {
    name: "Olabisi Onabanjo University",
    short_name: "OOU",
    city: "Ago-Iwoye",
    state: "Ogun State",
    type: "State",
    student_count: 28000,
    logo_url: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=200&q=80",
    lat: 6.9538,
    lng: 3.9214,
    campuses: [
      { name: "Main Campus Ago-Iwoye", campus_type: "Main Campus", city: "Ago-Iwoye", state: "Ogun State", lat: 6.9538, lng: 3.9214, description: "Administrative headquarters, Arts, Sciences, Social Sciences" },
      { name: "Sagamu Campus (Obafemi Awolowo College of Health)", campus_type: "Medical Campus", city: "Sagamu", state: "Ogun State", lat: 6.8450, lng: 3.6480, description: "College of Health Sciences & OOUTH teaching hospital" },
      { name: "Ibogun Campus (College of Engineering & Tech)", campus_type: "Engineering Campus", city: "Ibogun", state: "Ogun State", lat: 6.8920, lng: 3.2100, description: "Engineering workshops, robotics, telecommunications laboratories" }
    ]
  },
  {
    name: "Delta State University",
    short_name: "DELSU",
    city: "Abraka",
    state: "Delta State",
    type: "State",
    student_count: 26000,
    logo_url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=200&q=80",
    lat: 5.7924,
    lng: 6.1032,
    campuses: [
      { name: "Site III Main Campus (Abraka)", campus_type: "Main Campus", city: "Abraka", state: "Delta State", lat: 5.7924, lng: 6.1032, description: "Main Senate Building, Engineering, Sciences, Education" },
      { name: "Site II (Abraka)", campus_type: "Old Campus", city: "Abraka", state: "Delta State", lat: 5.7890, lng: 6.0980, description: "Arts & Humanities, Convocation Arena" },
      { name: "Oleh Campus (Faculty of Law & Engineering)", campus_type: "Law Campus", city: "Oleh", state: "Delta State", lat: 5.4600, lng: 6.2000, description: "Faculty of Law and agricultural engineering" }
    ]
  },
  {
    name: "Rivers State University",
    short_name: "RSU",
    city: "Port Harcourt",
    state: "Rivers State",
    type: "State",
    student_count: 29000,
    logo_url: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=200&q=80",
    lat: 4.7983,
    lng: 6.9850,
    campuses: [
      { name: "Nkpolu-Oroworukwo Main Campus", campus_type: "Main Campus", city: "Port Harcourt", state: "Rivers State", lat: 4.7983, lng: 6.9850, description: "Engineering, Environmental Sciences, Law, Management, College of Medical Sciences" }
    ]
  },
  {
    name: "Kaduna State University",
    short_name: "KASU",
    city: "Kaduna",
    state: "Kaduna State",
    type: "State",
    student_count: 22000,
    logo_url: "https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?auto=format&fit=crop&w=200&q=80",
    lat: 10.5105,
    lng: 7.4165,
    campuses: [
      { name: "Kaduna Main Campus (Tafawa Balewa Way)", campus_type: "Main Campus", city: "Kaduna", state: "Kaduna State", lat: 10.5105, lng: 7.4165, description: "Faculty of Science, Social Sciences, Arts, Barau Dikko Teaching Hospital" },
      { name: "Kafanchan Campus", campus_type: "Southern Campus", city: "Kafanchan", state: "Kaduna State", lat: 9.5850, lng: 8.3000, description: "Faculty of Agricultural Sciences, environmental studies" }
    ]
  },

  // --- PRIVATE UNIVERSITIES ---
  {
    name: "Covenant University",
    short_name: "Covenant",
    city: "Ota",
    state: "Ogun State",
    type: "Private",
    student_count: 12000,
    logo_url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=200&q=80",
    lat: 6.6726,
    lng: 3.1610,
    campuses: [
      { name: "Canaanland Main Campus", campus_type: "Main Campus", city: "Ota", state: "Ogun State", lat: 6.6726, lng: 3.1610, description: "Hebron Startup Lab, Peter Hall, Paul Hall, Esther Hall, Mary Hall, CST, CBSS" }
    ]
  },
  {
    name: "Babcock University",
    short_name: "Babcock",
    city: "Ilishan-Remo",
    state: "Ogun State",
    type: "Private",
    student_count: 14000,
    logo_url: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=200&q=80",
    lat: 6.8872,
    lng: 3.7176,
    campuses: [
      { name: "Ilishan-Remo Main Campus", campus_type: "Main Campus", city: "Ilishan-Remo", state: "Ogun State", lat: 6.8872, lng: 3.7176, description: "Babcock University Teaching Hospital, Benjamin Carson School of Medicine, Topaz & Crystal Halls" }
    ]
  },
  {
    name: "Afe Babalola University",
    short_name: "ABUAD",
    city: "Ado-Ekiti",
    state: "Ekiti State",
    type: "Private",
    student_count: 11000,
    logo_url: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=200&q=80",
    lat: 7.6041,
    lng: 5.3052,
    campuses: [
      { name: "ABUAD City Campus", campus_type: "Main Campus", city: "Ado-Ekiti", state: "Ekiti State", lat: 7.6041, lng: 5.3052, description: "ABUAD Multispecialty Hospital, College of Engineering, Law Auditorium, Student Halls" }
    ]
  },
  {
    name: "Nile University of Nigeria",
    short_name: "Nile",
    city: "Jabi, Abuja",
    state: "FCT Abuja",
    type: "Private",
    student_count: 9500,
    logo_url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=200&q=80",
    lat: 9.0425,
    lng: 7.3912,
    campuses: [
      { name: "Airport Bypass Campus (Jabi)", campus_type: "Main Campus", city: "Jabi, Abuja", state: "FCT Abuja", lat: 9.0425, lng: 7.3912, description: "Modern university campus, Hon. Justice Mohammed Bello Hall, Nile Tech Hub" }
    ]
  },
  {
    name: "Baze University",
    short_name: "Baze",
    city: "Jabi / Kuchingoro",
    state: "FCT Abuja",
    type: "Private",
    student_count: 8000,
    logo_url: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=200&q=80",
    lat: 9.0068,
    lng: 7.4285,
    campuses: [
      { name: "Cadastral Zone Campus", campus_type: "Main Campus", city: "Abuja", state: "FCT Abuja", lat: 9.0068, lng: 7.4285, description: "Baze Teaching Hospital, Faculty of Law, IT and Computing building" }
    ]
  },
  {
    name: "Pan-Atlantic University",
    short_name: "PAU",
    city: "Ibeju-Lekki",
    state: "Lagos State",
    type: "Private",
    student_count: 4500,
    logo_url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=200&q=80",
    lat: 6.4789,
    lng: 3.7548,
    campuses: [
      { name: "Main Campus (KM 52 Lekki-Epe Expressway)", campus_type: "Main Campus", city: "Ibeju-Lekki, Lagos", state: "Lagos State", lat: 6.4789, lng: 3.7548, description: "School of Media & Communication, EDC, SST Engineering, Pearl & Amber Halls" },
      { name: "Lagos Business School (LBS) Victoria Island", campus_type: "Executive Campus", city: "Ajah, Lagos", state: "Lagos State", lat: 6.4670, lng: 3.5680, description: "LBS executive hall, digital media laboratories" }
    ]
  }
];

export const POPULAR_MEETUPS_SEED = [
  {
    title: "FUTMINNA Tech & AI Developers Hackathon 2026",
    description: "Annual 36-hour sprint for student coders, UI/UX designers, and hardware makers. Cash prizes, tech gear giveaways, and internship interviews with top Nigerian tech companies.",
    category: "Technology & Innovation",
    university: "FUTMINNA",
    campus_name: "Gidan Kwano Main Campus",
    location: "SEET Complex Auditorium, Gidan Kwano",
    date_time: "2026-11-14 09:00:00",
    image_url: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80",
    organizer_name: "FUTMINNA Google Developer Student Club",
    organizer_role: "Campus Tech Lead",
    is_featured: 1,
    max_participants: 250,
    lat: 9.5312,
    lng: 6.4529
  },
  {
    title: "UNILAG Student Entrepreneurs & Thrift Trade Expo",
    description: "Over 80 student vendors showcasing fashion, gadgets, handmade crafts, sneakers, pastry, and photography services. Bring your SkulBuy QR to trade with zero transaction fees.",
    category: "Entrepreneurial Meetups",
    university: "UNILAG",
    campus_name: "Akoka Main Campus",
    location: "Jelili Omotola Multi-Purpose Hall, UNILAG Akoka",
    date_time: "2026-11-18 10:00:00",
    image_url: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80",
    organizer_name: "UNILAG Student Union Government (SUG)",
    organizer_role: "Director of Commercials",
    is_featured: 1,
    max_participants: 500,
    lat: 6.5173,
    lng: 3.3976
  },
  {
    title: "UniAbuja Hostel Pitch Night & Founders Networking",
    description: "An evening for student founders, freelancers, and creative minds. Connect with potential co-founders, pitch side hustles, and get feedback from alumni angel investors.",
    category: "Student Networking",
    university: "UniAbuja",
    campus_name: "Main Campus (Permanent Site)",
    location: "Faculty of Law Lecture Theatre, Permanent Site",
    date_time: "2026-11-20 16:30:00",
    image_url: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80",
    organizer_name: "UniAbuja Innovation Hub",
    organizer_role: "Student President",
    is_featured: 1,
    max_participants: 180,
    lat: 8.9754,
    lng: 7.1802
  },
  {
    title: "UI Design & Creative Tech Summit",
    description: "Hands-on masterclass covering Figma, Flutter, and generative AI design workflows for African youth. Free pizza and certificate of participation provided.",
    category: "Technology & Innovation",
    university: "UI",
    campus_name: "UI Main Campus",
    location: "Trenchard Hall, University of Ibadan",
    date_time: "2026-11-22 11:00:00",
    image_url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80",
    organizer_name: "UI Tech Creatives Alliance",
    organizer_role: "Lead Coordinator",
    is_featured: 0,
    max_participants: 200,
    lat: 7.4443,
    lng: 3.9003
  },
  {
    title: "OAU Campus Thrift & Pre-Exam Book Swap",
    description: "Trade textbooks, lab manuals, calculative materials, study desks, and fairly used electronic gadgets before the first semester examination rush starts.",
    category: "Campus Exhibitions & Fairs",
    university: "OAU",
    campus_name: "Central Campus (OAU Ife)",
    location: "Oduduwa Hall Foyer, OAU Ile-Ife",
    date_time: "2026-11-25 12:00:00",
    image_url: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80",
    organizer_name: "Great Ife Academic & Thrift Society",
    organizer_role: "Campus Ambassador",
    is_featured: 0,
    max_participants: 350,
    lat: 7.5186,
    lng: 4.5268
  },
  {
    title: "ABU Zaria Robotics & Embedded Hardware Demo",
    description: "Live demonstration of drones, solar tracking inverters, and agricultural IoT devices fabricated by ABU Zaria mechanical and electrical engineering students.",
    category: "Academic & Educational",
    university: "ABU Zaria",
    campus_name: "Samaru Main Campus",
    location: "Faculty of Engineering Main Auditorium, Samaru",
    date_time: "2026-11-28 10:00:00",
    image_url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80",
    organizer_name: "ABU Robotics Club",
    organizer_role: "Student Fellow",
    is_featured: 1,
    max_participants: 300,
    lat: 11.1528,
    lng: 7.6492
  },
  {
    title: "UNIBEN Inter-Faculty Football & Sports Carnival",
    description: "The grand kickoff of the University of Benin Dean's Cup! Music, food trucks, inter-hostel cheer competitions, and matchday jersey trading.",
    category: "Sports & Recreational",
    university: "UNIBEN",
    campus_name: "Ugbowo Main Campus",
    location: "UNIBEN Sports Complex Main Bowl, Ugbowo",
    date_time: "2026-11-30 15:00:00",
    image_url: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80",
    organizer_name: "UNIBEN Sports Directorate",
    organizer_role: "Sports Minister",
    is_featured: 0,
    max_participants: 600,
    lat: 6.4022,
    lng: 5.6173
  },
  {
    title: "Covenant University Campus Codefest & AI Sprint",
    description: "Exclusive campus hackathon exploring fintech, escrow APIs, and student commerce solutions. Mentorship from Y Combinator and Techstars alumni.",
    category: "Technology & Innovation",
    university: "Covenant",
    campus_name: "Canaanland Main Campus",
    location: "Hebron Startup Lab, Covenant University",
    date_time: "2026-12-03 09:30:00",
    image_url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
    organizer_name: "Hebron Tech Society",
    organizer_role: "Founder",
    is_featured: 1,
    max_participants: 150,
    lat: 6.6726,
    lng: 3.1610
  }
];

export const RENTAL_LISTINGS_SEED = [
  {
    seller_id: 2,
    category_id: 2, // Gadgets
    title: "Casio FX-991EX ClassWiz Advanced Scientific Calculator (Rental)",
    description: "Available for rent during test and exam weeks. High-resolution spreadsheet and matrix display. Fully approved for faculty examinations.",
    price: 1000,
    condition: "Fairly Used",
    is_negotiable: 0,
    is_boosted: 1,
    status: "active",
    is_rental: 1,
    rental_period: "per day",
    campus: "FUTMINNA",
    university: "FUTMINNA",
    campus_location: "Hostel Block B, Gidan Kwano Campus",
    image_url: "https://images.unsplash.com/photo-1611125832047-1d7ad1e8e48f?auto=format&fit=crop&w=600&q=80",
    views: 310
  },
  {
    seller_id: 4,
    category_id: 1, // Electronics
    title: "Epson Full HD 3500-Lumens Presentation Projector (Rental)",
    description: "Clean projector with HDMI cable and tripod screen. Ideal for project defense rehearsals, student fellowships, movie nights, or group seminars.",
    price: 5000,
    condition: "Fairly Used",
    is_negotiable: 1,
    is_boosted: 1,
    status: "active",
    is_rental: 1,
    rental_period: "per day",
    campus: "FUTMINNA",
    university: "FUTMINNA",
    campus_location: "Hall 3 Common Room, Gidan Kwano",
    image_url: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=600&q=80",
    views: 240
  },
  {
    seller_id: 2,
    category_id: 2, // Gadgets
    title: "Canon EOS 200D DSLR Camera + 18-55mm STM Lens (Rental)",
    description: "Lightweight 24.2MP DSLR with Dual Pixel autofocus. Excellent for student creative shoots, matriculation photos, birthday sessions, or department events.",
    price: 7500,
    condition: "Fairly Used",
    is_negotiable: 0,
    is_boosted: 1,
    status: "active",
    is_rental: 1,
    rental_period: "per day",
    campus: "UNILAG",
    university: "UNILAG",
    campus_location: "Faculty of Arts Quad, UNILAG Akoka",
    image_url: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80",
    views: 450
  },
  {
    seller_id: 3,
    category_id: 3, // Hostel Essentials
    title: "Heavy-Duty Standing Garment Steamer (1800W) (Rental)",
    description: "Fast crease removal for suits, native wear, matric gowns, and Sunday chapel outfits. Includes telescopic pole and hanger.",
    price: 1500,
    condition: "Fairly Used",
    is_negotiable: 0,
    is_boosted: 0,
    status: "active",
    is_rental: 1,
    rental_period: "per day",
    campus: "UniAbuja",
    university: "UniAbuja",
    campus_location: "Girls Hostel, Gwagwalada Campus",
    image_url: "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?auto=format&fit=crop&w=600&q=80",
    views: 180
  },
  {
    seller_id: 4,
    category_id: 4, // Fashion
    title: "Official Bachelor Degree Convocation Academic Gown + Cap (Rental)",
    description: "Complete ceremonial black gown, blue/gold trim hood, and mortarboard cap. Clean, dry-cleaned, ready for convocation week photoshoots.",
    price: 4000,
    condition: "Fairly Used",
    is_negotiable: 0,
    is_boosted: 1,
    status: "active",
    is_rental: 1,
    rental_period: "per week",
    campus: "FUTMINNA",
    university: "FUTMINNA",
    campus_location: "Bosso Campus Gate",
    image_url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=600&q=80",
    views: 520
  }
];
