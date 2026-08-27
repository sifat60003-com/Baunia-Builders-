import { Member, ShareTransaction } from '../types';

export interface RawMemberRecord {
  no: number;
  shareQty: number;
  nameBn: string;
  mobile: string;
  nid: string;
  nomineeName: string;
  nomineeNid: string;
}

export const rawMembersList: RawMemberRecord[] = [
  // Page 1 (1 - 28)
  { no: 1, shareQty: 1, nameBn: 'মোঃ মাহবুব সরকার', mobile: '01833405170', nid: '1016227058', nomineeName: 'মুহসিনা মারজান তহুরা', nomineeNid: '20212692552043320' },
  { no: 2, shareQty: 1, nameBn: 'মোঃ ইমাম খাঁন', mobile: '01634202702', nid: '5050442333', nomineeName: 'মোসাঃ রাবেয়া সুলতানা', nomineeNid: '6457823752' },
  { no: 3, shareQty: 1, nameBn: 'আবু রায়হান', mobile: '01644411581', nid: '9571444935', nomineeName: 'মোসাঃ সৈয়দ বানু', nomineeNid: '4619460514' },
  { no: 4, shareQty: 1, nameBn: 'মাহবুবুল হক', mobile: '01861133678', nid: '6417176473', nomineeName: 'নুসরাত জাহান', nomineeNid: '7364631890' },
  { no: 5, shareQty: 2, nameBn: 'শেফালী আক্তার', mobile: '01726088038', nid: '2841819853', nomineeName: 'এফ.এম.খাইরুল ইসলাম', nomineeNid: '8669224241' },
  { no: 6, shareQty: 1, nameBn: 'ফায়েজা সুলতানা রিক্তা', mobile: '01837457099', nid: '5557910501', nomineeName: 'আজিজুল হক', nomineeNid: '4658080496' },
  { no: 7, shareQty: 1, nameBn: 'ইসমাত জাহান', mobile: '01533518407', nid: '7315597539', nomineeName: 'মেহেরুন নেছা', nomineeNid: '8219398099' },
  { no: 8, shareQty: 1, nameBn: 'নুসরাত জাহান', mobile: '01889774359', nid: '7364631890', nomineeName: 'মাহবুবুল হক', nomineeNid: '6417176473' },
  { no: 9, shareQty: 2, nameBn: 'রেহেনা আক্তার', mobile: '01783046192', nid: '3012573537667', nomineeName: 'ফারজানা আক্তার লিপি', nomineeNid: '8684521175' },
  { no: 10, shareQty: 3, nameBn: 'আয়েশা সুলতানা', mobile: '01785891422', nid: '1594309594205', nomineeName: 'মোঃ এনাম হায়দার', nomineeNid: '2408123467' },
  { no: 11, shareQty: 1, nameBn: 'মোঃ মনিরুজ্জামান', mobile: '01739737454', nid: '1009721562', nomineeName: 'ফারজানা আক্তার লিপি', nomineeNid: '8684521175' },
  { no: 12, shareQty: 1, nameBn: 'ফারজানা আক্তার লিপি', mobile: '01903560464', nid: '8684521175', nomineeName: 'মোঃ মনিরুজ্জামান', nomineeNid: '1009721562' },
  { no: 13, shareQty: 1, nameBn: 'মোঃ মনির হোসেন', mobile: '01643468699', nid: '1469113920', nomineeName: 'মোছাঃ শিউলি আক্তার', nomineeNid: '5519129042' },
  { no: 14, shareQty: 1, nameBn: 'মুরাদ হোসেন', mobile: '01711240514', nid: '3719448627', nomineeName: 'শেখ পূরভী আক্তার', nomineeNid: '3307831515' },
  { no: 15, shareQty: 1, nameBn: 'মোঃ ফরহাদ হোসেন', mobile: '01937951343', nid: '3719449401', nomineeName: 'ফারহানা আক্তার জলি', nomineeNid: '5071066566' },
  { no: 16, shareQty: 1, nameBn: 'মোঃ মামুনুর রশিদ', mobile: '01949704356', nid: '4611814247', nomineeName: 'মোসাঃ শারমিন আক্তার', nomineeNid: '1906445356' },
  { no: 17, shareQty: 1, nameBn: 'মোঃ আবুল কালাম', mobile: '01924935071', nid: '8219326942', nomineeName: 'মোঃ সাদিকুর রহমান সিয়াম', nomineeNid: '20162692552046487' },
  { no: 18, shareQty: 1, nameBn: 'মোহাম্মদ নাজমুল হোসাইন', mobile: '01877337032', nid: '6436051665', nomineeName: 'নাফিস হোসাইন', nomineeNid: '20171517835118067' },
  { no: 19, shareQty: 1, nameBn: 'সুজন মিয়া', mobile: '01988812390', nid: '5969532133', nomineeName: 'নাছিমা বেগম', nomineeNid: '1469501637' },
  { no: 20, shareQty: 1, nameBn: 'মোহাম্মাদ কামরুজ্জামান', mobile: '01733617939', nid: '4173535016', nomineeName: 'মৌরিন আক্তার আশামনি', nomineeNid: '1910494051' },
  { no: 21, shareQty: 1, nameBn: 'মোঃ বাবু হোসেন', mobile: '01716134010', nid: '1459664791', nomineeName: 'সিফাত হাসান সিয়াম', nomineeNid: '5114895807' },
  { no: 22, shareQty: 1, nameBn: 'মোঃ শামিম হোসেন', mobile: '01834887087', nid: '3719447389', nomineeName: 'মিতু আক্তার', nomineeNid: '6004939259' },
  { no: 23, shareQty: 1, nameBn: 'মোঃ রাকিব হাসান', mobile: '01627019670', nid: '5969445757', nomineeName: 'রাশিদা আক্তার', nomineeNid: '6419620700' },
  { no: 24, shareQty: 1, nameBn: 'মোঃ মনির হোসেন', mobile: '01644443509', nid: '8230387204', nomineeName: 'সাকিন হোসেন', nomineeNid: '20071327104115816' },
  { no: 25, shareQty: 1, nameBn: 'মোঃ হানিফ হাওলাদার', mobile: '01779485460', nid: '9555033878', nomineeName: 'আসমা আক্তার', nomineeNid: '5102635520' },
  { no: 26, shareQty: 1, nameBn: 'রবিউল আলম', mobile: '01916385130', nid: '3514381492331', nomineeName: 'শামীমা নাসরিন', nomineeNid: '19943514361000095' },
  { no: 27, shareQty: 1, nameBn: 'রওশন আরা বেগম', mobile: '01818426825', nid: '8219445130', nomineeName: 'জান্নাতুল ফেরদৌস', nomineeNid: '19902619351000776' },
  { no: 28, shareQty: 1, nameBn: 'মোঃ জসিম উদ্দিন', mobile: '01715050802', nid: '8219436220', nomineeName: 'রিমা আক্তার', nomineeNid: '6869446556' },

  // Page 2 (29 - 59)
  { no: 29, shareQty: 1, nameBn: 'মোঃ মাসুম খান', mobile: '01813246987', nid: '686987551', nomineeName: 'রিমা আক্তার', nomineeNid: '3755752783' },
  { no: 30, shareQty: 1, nameBn: 'মোঃ আলী আজগর', mobile: '01833052533', nid: '3353098220875', nomineeName: 'মোছাঃ শিলা বেগম', nomineeNid: '19912619351001215' },
  { no: 31, shareQty: 1, nameBn: 'মোঃ রনি আহমেদ', mobile: '01730177988', nid: '6871652779', nomineeName: 'মোসাঃ সিরাজাম মনিরা', nomineeNid: '6468896789' },
  { no: 32, shareQty: 1, nameBn: 'মোঃ ইলিয়াছ', mobile: '01835096314', nid: '1919552743', nomineeName: 'মোঃ রবিন মাহমুদ', nomineeNid: '4607570340' },
  { no: 33, shareQty: 1, nameBn: 'তাহের দেওয়ান', mobile: '01758995079', nid: '8669410428', nomineeName: 'মোঃ জবেদ দেওয়ান', nomineeNid: '3754737504' },
  { no: 34, shareQty: 1, nameBn: 'মোঃ জাবেদ দেওয়ান', mobile: '01674342398', nid: '3754737504', nomineeName: 'সেলিনা আক্তার', nomineeNid: '6923004110' },
  { no: 35, shareQty: 1, nameBn: 'মোঃ সোহাগ শেখ', mobile: '01720927316', nid: '1919353670', nomineeName: 'কুলছুম বেগম', nomineeNid: '2369326463' },
  { no: 36, shareQty: 1, nameBn: 'মোঃ সুরুজ আলী', mobile: '01967940492', nid: '3706676396', nomineeName: 'শাহীন মিয়া', nomineeNid: '8269489780' },
  { no: 37, shareQty: 1, nameBn: 'মোঃ আলমগীর দেওয়ান', mobile: '01937079546', nid: '4643437421', nomineeName: 'সোহাগী আক্তার', nomineeNid: '8265394604' },
  { no: 38, shareQty: 1, nameBn: 'মোহাম্মদ অলিউল্লাহ', mobile: '+97450610511', nid: '19851815538012820', nomineeName: 'মুক্তা আক্তার', nomineeNid: '2819446747' },
  { no: 39, shareQty: 1, nameBn: 'মোঃ জালাল উদ্দীন', mobile: '01869119660', nid: '1027392214', nomineeName: 'জাহানারা বেগম', nomineeNid: '5519315088' },
  { no: 40, shareQty: 1, nameBn: 'মোঃ খোকন', mobile: '01760389608', nid: '5069015674', nomineeName: 'আফিফা সুলতানা মরিয়ম', nomineeNid: '20195114315117272' },
  { no: 41, shareQty: 1, nameBn: 'ইব্রাহিম হোসেন', mobile: '01708151526', nid: '6401800864', nomineeName: 'মোছাঃ রোকেয়া খাতুন', nomineeNid: '8718615315735' },
  { no: 42, shareQty: 1, nameBn: 'মোঃ বেলাল হোসেন', mobile: '01794342368', nid: '19872692620000234', nomineeName: 'হাছনা আক্তার', nomineeNid: '6884422954' },
  { no: 43, shareQty: 1, nameBn: 'মাহবুবা আক্তার', mobile: '01719566282', nid: '8715174929', nomineeName: 'ফরিদা আক্তার', nomineeNid: '5069437456' },
  { no: 44, shareQty: 1, nameBn: 'তমিজউদ্দিন', mobile: '01754823284', nid: '6869376399', nomineeName: 'কোহিনুর বেগম', nomineeNid: '7769385258' },
  { no: 45, shareQty: 1, nameBn: 'মোঃ নাসির', mobile: '01707118222', nid: '8200068230', nomineeName: 'মোছাঃ শিরিন আক্তার', nomineeNid: '8669935663' },
  { no: 46, shareQty: 1, nameBn: 'মোঃ শাহাদাত হোসেন', mobile: '01822075199', nid: '3308034895', nomineeName: 'শাহানাজ', nomineeNid: '1951446127' },
  { no: 47, shareQty: 1, nameBn: 'জাহানারা আক্তার', mobile: '01739888947', nid: '8692834164', nomineeName: 'মোঃ মাহামুদুল হাসান', nomineeNid: '20136112250137583' },
  { no: 48, shareQty: 1, nameBn: 'মোঃ ফয়েজুর রহমান খান', mobile: '01713659226', nid: '5069322567', nomineeName: 'লুৎফুন্নাহার', nomineeNid: '6863256076' },
  { no: 49, shareQty: 1, nameBn: 'রমিজউদ্দিন', mobile: '01346857474', nid: '2819391067', nomineeName: 'আছমা বেগম', nomineeNid: '2619351190882' },
  { no: 50, shareQty: 1, nameBn: 'আসলাম দেওয়ান', mobile: '01865368126', nid: '4170312567', nomineeName: 'মারিয়া জান্নাতুল সিনহা', nomineeNid: '20102619351101693' },
  { no: 51, shareQty: 1, nameBn: 'মোঃ শফিকুল ইসলাম', mobile: '01786247566', nid: '8258072423', nomineeName: 'লামিয়া আক্তার', nomineeNid: '6479772326' },
  { no: 52, shareQty: 1, nameBn: 'মোঃ লিটন হোসেন', mobile: '01766229390', nid: '7786880471', nomineeName: 'মারুফ আলম মৃদুল', nomineeNid: '2429859875' },
  { no: 53, shareQty: 1, nameBn: 'মারুফ আলম মৃদুল', mobile: '01975565021', nid: '2429859875', nomineeName: 'মোঃ লিটন হোসেন', nomineeNid: '7786880471' },
  { no: 54, shareQty: 1, nameBn: 'সুভা বেগম', mobile: '01846961869', nid: '5075655067', nomineeName: 'মোঃ রিপন', nomineeNid: '3724402643' },
  { no: 55, shareQty: 1, nameBn: 'মোঃ সুজন', mobile: '+96897168390', nid: '6961363057', nomineeName: 'জাহেদা বেগম', nomineeNid: '2359516628' },
  { no: 56, shareQty: 1, nameBn: 'মোঃ সেলিম আহমেদ', mobile: '01717924080', nid: '3719398715', nomineeName: 'শিমু আক্তার', nomineeNid: '4619414099' },
  { no: 57, shareQty: 1, nameBn: 'আবদুর রাজ্জাক', mobile: '01724824512', nid: '9119390640', nomineeName: 'রোকেয়া আক্তার প্রিয়া', nomineeNid: '1975564582' },
  { no: 58, shareQty: 1, nameBn: 'ফাতেমা বেগম', mobile: '01913247649', nid: '5069436433', nomineeName: 'মোঃ ফরহাদ হোসেন', nomineeNid: '3719449401' },
  { no: 59, shareQty: 1, nameBn: 'নাজমুল হুদা', mobile: '01711130577', nid: '0626901653410', nomineeName: 'মার্জিয়া হুদা', nomineeNid: '0626901653113' },

  // Page 3 (60 - 89)
  { no: 60, shareQty: 1, nameBn: 'আদনান জাইদি', mobile: '01646317466', nid: '4229793825', nomineeName: 'মার্জিয়া হুদা', nomineeNid: '0626901653113' },
  { no: 61, shareQty: 1, nameBn: 'মোঃ হযরত আলী', mobile: '01734504612', nid: '1469519993', nomineeName: 'হাসিবুর রহমান', nomineeNid: '4229790441' },
  { no: 62, shareQty: 1, nameBn: 'মোঃ দৌলত হোসেন', mobile: '01865361635', nid: '9559754230', nomineeName: 'মোঃ রাব্বি হাছান নাঈম', nomineeNid: '7801811089' },
  { no: 63, shareQty: 1, nameBn: 'হারুন অর রশীদ', mobile: '01682269863', nid: '9151763142', nomineeName: 'স্বপ্না আক্তার', nomineeNid: '2864180738' },
  { no: 64, shareQty: 1, nameBn: 'মোঃ ফিরোজ মিয়া', mobile: '01723383125', nid: '5105352990', nomineeName: 'মোছাঃ ফিরোজা বেগম', nomineeNid: '9313865586478' },
  { no: 65, shareQty: 1, nameBn: 'মোঃ মাহামুদ মিয়া', mobile: '01786649056', nid: '8254498341', nomineeName: 'মিম আক্তার', nomineeNid: '8713171786' },
  { no: 66, shareQty: 1, nameBn: 'মোঃ রাসেল হোসেন খান', mobile: '01845741957', nid: '8227626028', nomineeName: 'মোসাঃ কনক চাঁপা বিথী', nomineeNid: '7814892142' },
  { no: 67, shareQty: 1, nameBn: 'মোঃ মাহবুবুর রহমান', mobile: '01727232020', nid: '1003414958', nomineeName: 'নাহিদা আক্তার', nomineeNid: '2813603350' },
  { no: 68, shareQty: 1, nameBn: 'মোঃ ফারুক হোসেন', mobile: '01678044255', nid: '2819441912', nomineeName: 'আয়েশা আক্তার', nomineeNid: '1469123713' },
  { no: 69, shareQty: 1, nameBn: 'মোঃ সুমন', mobile: '01997640953', nid: '7364427356', nomineeName: 'মোঃ শহর আলী', nomineeNid: '6899137571' },
  { no: 70, shareQty: 1, nameBn: 'মোঃ রবিউল ইসলাম রনি', mobile: '01317423358', nid: '8264369649', nomineeName: 'নার্গিস বেগম', nomineeNid: '2611038903887' },
  { no: 71, shareQty: 1, nameBn: 'বিপুল কর্মকার', mobile: '01686127676', nid: '5519841349', nomineeName: 'পূজা কর্মকার', nomineeNid: '6458357164' },
  { no: 72, shareQty: 1, nameBn: 'মোঃ ইসহাক মিয়া', mobile: '01914213290', nid: '5969395838', nomineeName: 'সাহানাজ আক্তার', nomineeNid: '7319636077' },
  { no: 73, shareQty: 1, nameBn: 'মোঃ আজাহার আলী', mobile: '01825794163', nid: '4169388693', nomineeName: 'শিলা', nomineeNid: '6419622755' },
  { no: 74, shareQty: 1, nameBn: 'শিলা', mobile: '01825794163', nid: '6419622755', nomineeName: 'মোঃ আজাহার আলী', nomineeNid: '4169388693' },
  { no: 75, shareQty: 1, nameBn: 'নাফিসা সাদাফ', mobile: '01877337032', nid: '20131517835118069', nomineeName: 'মোহাম্মদ নাজমুল হোসাইন', nomineeNid: '6436051665' },
  { no: 76, shareQty: 1, nameBn: 'মাহমুদা আক্তার', mobile: '01719888422', nid: '9577146435', nomineeName: 'মোঃ মাহবুব সরকার', nomineeNid: '1016227058' },
  { no: 77, shareQty: 1, nameBn: 'মোঃ কাওসার', mobile: '01917383880', nid: '1924911439', nomineeName: 'মোছাঃ কল্পনা খাতুন', nomineeNid: '6897000862' },
  { no: 78, shareQty: 1, nameBn: 'মোছাঃ কল্পনা খাতুন', mobile: '01922898587', nid: '6897000862', nomineeName: 'মোঃ কাওসার', nomineeNid: '1924911439' },
  { no: 79, shareQty: 1, nameBn: 'মোঃ রেজাউল', mobile: '01345505445', nid: '4628704100', nomineeName: 'লিপি বেগম', nomineeNid: '5053849732' },
  { no: 80, shareQty: 1, nameBn: 'মোঃ মিলন হাওলাদার', mobile: '01712398397', nid: '5992318021', nomineeName: 'মোঃ তাজিম হাওলাদার', nomineeNid: '20150610794105253' },
  { no: 81, shareQty: 1, nameBn: 'মোঃ সোহেল চৌধুরী', mobile: '01301617936', nid: '5107189499', nomineeName: 'শেখ শরিফা আক্তার', nomineeNid: '2824760124' },
  { no: 82, shareQty: 1, nameBn: 'ফারহান সাদিক তাহমিদ', mobile: '01611252427', nid: '20162692552016534', nomineeName: 'লাইলী আক্তার', nomineeNid: '1919538916' },
  { no: 83, shareQty: 1, nameBn: 'জাকিয়া সুলতানা', mobile: '01626212081', nid: '2819451267', nomineeName: 'মোঃ আবু ইউসুফ', nomineeNid: '8234781089' },
  { no: 84, shareQty: 1, nameBn: 'মোঃ সহিদুল ইসকান্দার', mobile: '01710169122', nid: '1461649954', nomineeName: 'রুবিনা আক্তার', nomineeNid: '2375123755' },
  { no: 85, shareQty: 1, nameBn: 'আব্দুল হাকীম', mobile: '01831001276', nid: '2819530433', nomineeName: 'মোহাম্মদ সাইফ আল হাসান', nomineeNid: '1982513713' },
  { no: 86, shareQty: 1, nameBn: 'মোঃ মোক্তারুজ্জামান', mobile: '01929921512', nid: '7316488306404', nomineeName: 'মোছাঃ সাইয়েদা পারভীন', nomineeNid: '9552807647' },
  { no: 87, shareQty: 1, nameBn: 'আবদুল কাদির', mobile: '01755584932', nid: '1939561088', nomineeName: 'ফারজানা আহমেদ', nomineeNid: '5081169772' },
  { no: 88, shareQty: 1, nameBn: 'আব্দুল করিম', mobile: '01335174816', nid: '1490489315', nomineeName: 'তানজিলা আক্তার', nomineeNid: '5103804760' },
  { no: 89, shareQty: 1, nameBn: 'মোছাঃ লোপা আক্তার রিমি', mobile: '01780141666', nid: '3298787452', nomineeName: 'মোঃ ইসরাত আলবি আলিফ', nomineeNid: '20111916751062756' },

  // Page 4 (90 - 96)
  { no: 90, shareQty: 1, nameBn: 'মোঃ কামাল হোসেন', mobile: '01882125495', nid: '9107408271', nomineeName: 'মোঃ আমিরুল ইসলাম আলিফ', nomineeNid: '4664363316' },
  { no: 91, shareQty: 1, nameBn: 'মোঃ ফরমান হোসেন', mobile: '01994661435', nid: '7775109932', nomineeName: 'সুমী আক্তার', nomineeNid: '4169523141' },
  { no: 92, shareQty: 1, nameBn: 'মোঃ আব্দুল্লাহ আল মামুন', mobile: '01682313209', nid: '7802121264', nomineeName: 'সুমাইয়া খাতুন', nomineeNid: '5102083440' },
  { no: 93, shareQty: 1, nameBn: 'আবু বক্কর সিদ্দিক', mobile: '01721128881', nid: '6419387151', nomineeName: 'রুবিনা আক্তার', nomineeNid: '9119395078' },
  { no: 94, shareQty: 1, nameBn: 'মোঃ শামছুল হক', mobile: '01716105382', nid: '3269383810', nomineeName: 'জিয়াছমিন আক্তার', nomineeNid: '6869380128' },
  { no: 95, shareQty: 1, nameBn: 'মোঃ আল মামুন', mobile: '01718572372', nid: '8222770268', nomineeName: 'মাহমুদা সুলতানা', nomineeNid: '7349491444' },
  { no: 96, shareQty: 1, nameBn: 'মোঃ বাবুল মিয়া', mobile: '01946955234', nid: '2819384468', nomineeName: 'মোছাঃ তানজিরা জাহান বেবী', nomineeNid: '5563830156' }
];

export const generateMembersFromRaw = (): Member[] => {
  return rawMembersList.map((m) => {
    const formattedId = `BB-${String(m.no).padStart(3, '0')}`;
    const sharePrice = 100000;
    const totalShareValue = m.shareQty * sharePrice;

    return {
      id: formattedId,
      memberNo: m.no,
      nameBn: m.nameBn,
      nameEn: `Member ${m.no}`,
      fatherName: '—',
      motherName: '—',
      spouseName: '',
      dob: '1985-01-01',
      gender: 'male',
      nid: m.nid || `NID-${m.no}`,
      mobile: m.mobile,
      occupation: 'ব্যবসায়ী',
      presentAddress: 'বাউনিয়া, তুরাগ, ঢাকা-১২৩০',
      permanentAddress: 'বাউনিয়া, তুরাগ, ঢাকা',
      joinDate: '2026-01-01',
      status: 'active',
      shareQty: m.shareQty,
      sharePrice: sharePrice,
      totalShareValue: totalShareValue,
      monthlyFee: 2000,
      openingBalance: 0,
      currentDeposit: 0,
      currentDue: 0,
      nominees: [
        {
          id: `NOM-${formattedId}-1`,
          name: m.nomineeName,
          relation: 'নমিনী',
          nidBirthReg: m.nomineeNid,
          mobile: m.mobile,
          address: 'বাউনিয়া, তুরাগ, ঢাকা',
          percentage: 100
        }
      ],
      createdAt: '2026-01-01',
      updatedAt: '2026-08-27'
    };
  });
};

export const generateShareTransactionsFromMembers = (membersList: Member[]): ShareTransaction[] => {
  return membersList.map((m, idx) => ({
    id: `ST-${String(idx + 1).padStart(4, '0')}`,
    memberId: m.id,
    memberName: m.nameBn,
    type: 'initial',
    shareQty: m.shareQty,
    sharePrice: m.sharePrice,
    totalAmount: m.totalShareValue,
    date: '2026-01-01',
    certificateNo: `CERT-2026-${String(m.memberNo).padStart(3, '0')}`,
    notes: 'প্রাথমিক শেয়ার বরাদ্দ',
    approvedBy: 'সভাপতি ও সাধারণ সম্পাদক',
    createdAt: '2026-01-01'
  }));
};
