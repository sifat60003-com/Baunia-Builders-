import { Member, ShareTransaction } from '../types';
import { nomineeExtDetails } from './nomineesData';

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

export const memberExtDetails: Record<number, {
  nameEn: string;
  fatherName: string;
  motherName: string;
  dob: string;
  occupation: string;
  presentAddress: string;
  permanentAddress: string;
  gender: 'male' | 'female';
}> = {
  1: {
    nameEn: 'MD. MAHBUB SARKAR',
    fatherName: 'মোঃ রিয়াজ উদ্দিন সরকার',
    motherName: 'ফরিদা আক্তার',
    dob: '1994-12-06',
    occupation: 'ব্যবসা',
    presentAddress: 'বাসা/হোল্ডিং- ৫/৩, গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    permanentAddress: 'বাসা/হোল্ডিং- ৫/৩, গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    gender: 'male'
  },
  2: {
    nameEn: 'MD. IMAM KHAN',
    fatherName: 'মোঃ ছাদেক খাঁন',
    motherName: 'মিসেস মাফিয়া বেগম',
    dob: '1989-12-17',
    occupation: 'ব্যবসা',
    presentAddress: 'বাসা/হোল্ডিং- ১৮১০৫/৬, গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    permanentAddress: 'বাসা/হোল্ডিং- ১৮১০৫/৬, gram: বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    gender: 'male'
  },
  3: {
    nameEn: 'ABU RAIHAN',
    fatherName: 'নুরুজ্জামান',
    motherName: 'সায়দা জামান',
    dob: '1995-01-01',
    occupation: 'চাকুরীজীবী',
    presentAddress: 'গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    permanentAddress: 'গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    gender: 'male'
  },
  4: {
    nameEn: 'MAHABOBUL HOQUE',
    fatherName: 'সুরু মিয়া',
    motherName: 'ছেনোয়ারা খাতুন',
    dob: '1979-01-01',
    occupation: 'ব্যবসা',
    presentAddress: 'গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    permanentAddress: 'বাসা/হোল্ডিং-বড় বাড়ী, গ্রামঃ বান্দের জলা, পোঃ আলকরা, থানাঃ চৌদ্দগ্রাম, জেলাঃ কুমিল্লা',
    gender: 'male'
  },
  5: {
    nameEn: 'SEFALY AKTER',
    fatherName: 'মোঃ নুরুজ্জামান',
    motherName: 'সায়েদা বেগম',
    dob: '1990-02-26',
    occupation: 'গৃহিণী',
    presentAddress: 'বাসা/হোল্ডিং-, গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    permanentAddress: 'বাসা/হোল্ডিং-, গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    gender: 'female'
  },
  6: {
    nameEn: 'FAYAJA SULTANA RIKTA',
    fatherName: 'সাইফ উদ্দিন ভূঞা',
    motherName: 'কানিজ ফাতেমা',
    dob: '1996-05-28',
    occupation: 'গৃহিণী',
    presentAddress: 'বাসা/হোল্ডিং-৪২, ব্লক-বি, গ্রামঃ পূর্ব বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    permanentAddress: 'বাসা/হোল্ডিং-৪২, ব্লক-বি, গ্রামঃ পূর্ব বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    gender: 'female'
  },
  7: {
    nameEn: 'ISMAT JAHAN',
    fatherName: 'মাহবুবুল হক',
    motherName: 'মেহেরুন নেছা',
    dob: '1996-10-17',
    occupation: 'চাকুরীজীবী',
    presentAddress: 'বাসা/হোল্ডিং-৪২, গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    permanentAddress: 'বাসা/হোল্ডিং-৪২, গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    gender: 'female'
  },
  8: {
    nameEn: 'NUSRAT JAHAN',
    fatherName: 'মাহবুবুল হক',
    motherName: 'মেহেরুন নেছা',
    dob: '1997-08-12',
    occupation: 'ছাত্রী',
    presentAddress: 'বাসা/হোল্ডিং-৪২,  ব্লক-বি, গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    permanentAddress: 'বাসা/হোল্ডিং-৪২,  ব্লক-বি, গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    gender: 'female'
  },
  9: {
    nameEn: 'REHANA AKTER',
    fatherName: '—',
    motherName: 'ছেনোয়ারা খাতুন',
    dob: '1977-10-12',
    occupation: 'গৃহিণী',
    presentAddress: 'গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    permanentAddress: 'বাসা/হোল্ডিং-ওসমান আলী মিয়া বাড়ী, গ্রামঃ জয়নাকান্দিপুর / জনারায়নপুর, পোঃ রাজাপুর ৩৯২৩, থানাঃ দাগনভূঁঞা, জেলাঃ ফেনী',
    gender: 'female'
  },
  10: {
    nameEn: 'AYESHA SULTANA',
    fatherName: '—',
    motherName: 'কানিজ ফাতেমা',
    dob: '1987-03-17',
    occupation: 'গৃহিণী',
    presentAddress: 'বাসা/হোল্ডিং-, গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    permanentAddress: 'বাসা/হোল্ডিং-ই ব্লক-১৩৪, গ্রামঃ বিশ্ব ব্যাংক কলোনী, পোঃ ফিরোজ শাহ-৪২০৭, থানাঃ খুলশী, জেলাঃ চট্টগ্রাম',
    gender: 'female'
  },
  11: {
    nameEn: 'MD. MONIRUZZAMAN',
    fatherName: 'মোঃ নুরুজ্জামান',
    motherName: 'মোসাঃ সৈয়দ বানু',
    dob: '1985-12-30',
    occupation: 'ব্যবসা',
    presentAddress: 'বাসা/হোল্ডিং-৫৭, রাস্তাঃ লেন ৩, ব্লক এ, গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    permanentAddress: 'বাসা/হোল্ডিং-৫৭, রাস্তাঃ লেন ৩, ব্লক এ, গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    gender: 'male'
  },
  12: {
    nameEn: 'FARZANA AKTER LIPY',
    fatherName: 'আব্দুল লতিফ',
    motherName: 'রেহেনা বেগম',
    dob: '1996-09-01',
    occupation: 'গৃহিণী',
    presentAddress: 'বাসা/হোল্ডিং-৫৭, রাস্তাঃ লেন ৩, ব্লক এ, গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    permanentAddress: 'বাসা/হোল্ডিং-৫৭, রাস্তাঃ লেন ৩, ব্লক এ, gram: বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    gender: 'female'
  },
  13: {
    nameEn: 'MD MONIR HOSEN',
    fatherName: 'মোঃ দনু মিয়া',
    motherName: 'মোসাঃ হাসিনা বেগম',
    dob: '1980-07-19',
    occupation: 'ব্যবসা',
    presentAddress: 'বাসা/হোল্ডিং-১১, রাস্তাঃ লেন-৪, ব্লক-বি, গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    permanentAddress: 'বাসা/হোল্ডিং-১১, রাস্তাঃ লেন-৪, ব্লক-বি, গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    gender: 'male'
  },
  14: {
    nameEn: 'MORAD HOSSAIN',
    fatherName: 'তোতা মিয়া',
    motherName: 'সখিনা বিবি',
    dob: '1981-05-01',
    occupation: 'ব্যবসা',
    presentAddress: 'বাসা/হোল্ডিং-১৪, গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    permanentAddress: 'বাসা/হোল্ডিং-১৪, গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    gender: 'male'
  },
  15: {
    nameEn: 'MD. FARHAD HOSSAIN',
    fatherName: 'আব্দুল জব্বার',
    motherName: 'ফাতেমা বেগম',
    dob: '1984-11-10',
    occupation: 'ব্যবসা',
    presentAddress: 'বাসা/হোল্ডিং-২২, গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    permanentAddress: 'বাসা/হোল্ডিং-২২, গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    gender: 'male'
  },
  16: {
    nameEn: 'MD. MAMOUNUR RASHID',
    fatherName: 'মোঃ সুন্দর আলী',
    motherName: 'মোসাঃ জাহানারা বেগম',
    dob: '1982-09-01',
    occupation: 'ব্যবসা',
    presentAddress: 'বাসা/হোল্ডিং-৩৫, gram: বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    permanentAddress: 'বাসা/হোল্ডিং-৩৫, গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    gender: 'male'
  },
  17: {
    nameEn: 'MD ABUL KALAM',
    fatherName: 'ঠান্ডা মিয়া',
    motherName: 'মর্জিনা বেগম',
    dob: '1988-09-27',
    occupation: 'ঠিকাদার',
    presentAddress: 'রাস্তাঃ তোতা মিয়া সরণী, গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    permanentAddress: 'রাস্তাঃ তোতা মিয়া সরণী, গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    gender: 'male'
  },
  18: {
    nameEn: 'MOHAMMED NAZMUL HOSSAIN',
    fatherName: 'মোহাম্মদ শহিদ উল্যাহ',
    motherName: 'আনোয়ারা বেগম',
    dob: '1979-12-29',
    occupation: 'চাকুরীজীবী',
    presentAddress: 'গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    permanentAddress: 'বাসা/হোল্ডিং-শহিদ উল্যাহ ভেন্ডার এর বাড়ী, গ্রামঃ হারানিয়া, পোঃ বক্তার হাট-৪৩০০, থানাঃ সন্দ্বীপ, জেলাঃ চট্টগ্রাম',
    gender: 'male'
  },
  19: {
    nameEn: 'SUJAN MIAH',
    fatherName: 'সিরাজ মিয়া',
    motherName: 'রাজিয়া বেগম',
    dob: '1982-08-05',
    occupation: 'ঠিকাদার',
    presentAddress: 'গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    permanentAddress: 'গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    gender: 'male'
  },
  20: {
    nameEn: 'MOHAMMAD KAMRUZZAMAN',
    fatherName: 'মোঃ হারুন অর রশিদ হাওলাদার',
    motherName: 'মোসাঃ আমিরুন নেছা',
    dob: '1975-02-10',
    occupation: 'ব্যবসা',
    presentAddress: 'গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    permanentAddress: 'বাসা/হোল্ডিং-০৫, গ্রামঃ রমজান কাঠী, পোঃ রমজান কাঠী-৮২১০, থানাঃ বাকেরগঞ্জ, জেলাঃ বরিশাল',
    gender: 'male'
  },
  21: {
    nameEn: 'MD BABU HOSEN',
    fatherName: 'আলাউদ্দিন মন্ডল',
    motherName: 'জোস্না বিবি',
    dob: '1982-01-01',
    occupation: 'ঠিকাদার',
    presentAddress: 'গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    permanentAddress: 'গ্রামঃ উত্তর পশ্চিম রুকিন্দিপুর, পোঃ জামালগঞ্জ, থানাঃ আক্কেলপুর, জেলাঃ জয়পুরহাট',
    gender: 'male'
  },
  22: {
    nameEn: 'MD. SHAMIM HOSIN',
    fatherName: 'মোঃ ফজর আলী',
    motherName: 'মোসাঃ রাাহিমা খাতুন',
    dob: '1984-12-21',
    occupation: 'চাকুরীজীবী',
    presentAddress: 'বাসা/হোল্ডিং-৪,  ব্লক-এ, রাস্তাঃ ৪, গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    permanentAddress: 'বাসা/হোল্ডিং-৪,  ব্লক-এ, রাস্তাঃ ৪, গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    gender: 'male'
  },
  23: {
    nameEn: 'MD RAKIB HASAN',
    fatherName: 'মোঃ ফজর আলী',
    motherName: 'রাাহিমা',
    dob: '1982-09-10',
    occupation: 'ব্যবসা',
    presentAddress: 'বাসা/হোল্ডিং-৪,  ব্লক-এ, রাস্তাঃ ৪, গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    permanentAddress: 'বাসা/হোল্ডিং-৪,  ব্লক-এ, রাস্তাঃ ৪, গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    gender: 'male'
  },
  24: {
    nameEn: 'MD. MONIR HOSSAN',
    fatherName: 'মোঃ ইহছাক',
    motherName: 'ফজিলেতের নেছা',
    dob: '1974-12-20',
    occupation: 'ব্যবসা',
    presentAddress: 'গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    permanentAddress: 'বাসা/হোল্ডিং-৪৫, গ্রামঃ উত্তর উদমদী, পোঃ বরদিয়া-৩৬০২, থানাঃ মতলব, জেলাঃ চাঁদপুর',
    gender: 'male'
  },
  25: {
    nameEn: 'MD HANIF HOWLADER',
    fatherName: 'মোঃ আঃ করিম হাওলাদার',
    motherName: 'রাাহিমা বেগম',
    dob: '1975-03-25',
    occupation: 'চাকুরীজীবী',
    presentAddress: 'গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    permanentAddress: 'গ্রামঃ ভরসাকাঠী, পোঃ ভরসাকাঠী-৮২২৪, থানাঃ উজিরপুর, জেলাঃ বরিশাল',
    gender: 'male'
  },
  26: {
    nameEn: 'RABIUL ALAM',
    fatherName: 'কুদ্দুছ মোল্ল্যা',
    motherName: 'হালিমা বেগম',
    dob: '1986-02-11',
    occupation: 'চাকুরীজীবী',
    presentAddress: 'গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    permanentAddress: 'গ্রামঃ চরচন্ডা, পোঃ সোনাপাড়া-৮১৩২, থানাঃ কাশিয়ানী, জেলাঃ গোপালগঞ্জ',
    gender: 'male'
  },
  27: {
    nameEn: 'ROWSHAN ARA BEGUM',
    fatherName: 'আব্দুল হোসাইন',
    motherName: 'ছেনোয়ারা খাতুন',
    dob: '1968-05-15',
    occupation: 'গৃহিণী',
    presentAddress: 'বাসা/হোল্ডিং-৭৫,  ব্লক-বি, গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    permanentAddress: 'বাসা/হোল্ডিং-৭৫,  ব্লক-বি, গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    gender: 'female'
  },
  28: {
    nameEn: 'MD JASHIM UDDIN',
    fatherName: 'সামসুদ্দিন',
    motherName: 'হালিমা বেগম',
    dob: '1987-02-02',
    occupation: 'ব্যবসা',
    presentAddress: 'বাসা/হোল্ডিং-২০,  ব্লক-এ, গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    permanentAddress: 'বাসা/হোল্ডিং-২০,  ব্লক-এ, গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    gender: 'male'
  },
  29: {
    nameEn: 'MD MASUM KHAN',
    fatherName: 'মোঃ শুক্কুর আলী খান',
    motherName: 'মোসাঃ মোর্শেদা বেগম',
    dob: '1985-10-22',
    occupation: 'ব্যবসা',
    presentAddress: 'বাসা/হোল্ডিং-২,  ব্লক-সি, gram: বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    permanentAddress: 'বাসা/হোল্ডিং-২,  ব্লক-সি, গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    gender: 'male'
  },
  30: {
    nameEn: 'MD. ALL AZGAR',
    fatherName: 'মোঃ সিকিম আলী',
    motherName: 'মোসাঃ দিলবাহার',
    dob: '1988-01-04',
    occupation: 'চাকুরীজীবী',
    presentAddress: 'গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    permanentAddress: 'গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    gender: 'male'
  },
  31: {
    nameEn: 'MD. RONY AHAMED',
    fatherName: 'মোঃ সিকিম আলী',
    motherName: 'দেলোয়ারা বেগম',
    dob: '1995-10-13',
    occupation: 'ঠিকাদার',
    presentAddress: 'বাসা/হোল্ডিং-১৫/২, গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    permanentAddress: 'বাসা/হোল্ডিং-১৫/২, গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    gender: 'male'
  },
  32: {
    nameEn: 'MD ILIAS',
    fatherName: 'মোঃ হাফিজ উদ্দিন',
    motherName: 'হালিমা',
    dob: '1989-08-11',
    occupation: 'ঠিকাদার',
    presentAddress: 'গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    permanentAddress: 'গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    gender: 'male'
  },
  33: {
    nameEn: 'TAHER DAUYAN',
    fatherName: 'আবেদ আলী দেওয়ান',
    motherName: 'রেজিয়া খাতুন',
    dob: '1968-09-04',
    occupation: 'ঠিকাদার',
    presentAddress: 'বাসা/হোল্ডিং-৩, লেন-২, ব্লক-বি, গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    permanentAddress: 'বাসা/হোল্ডিং-৩, লেন-২, ব্লক-বি, গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    gender: 'male'
  },
  34: {
    nameEn: 'MD. JAVED DEWAN',
    fatherName: 'তাহের দেওয়ান',
    motherName: 'মোসাঃ জোনাকি',
    dob: '1999-02-09',
    occupation: 'ব্যবসা',
    presentAddress: 'বাসা/হোল্ডিং-৩, গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    permanentAddress: 'বাসা/হোল্ডিং-৩, গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    gender: 'male'
  },
  35: {
    nameEn: 'MD SHOHAG SHEKH',
    fatherName: 'মোঃ চাঁদ মিয়া',
    motherName: 'মোহসেনা আরা বেগম',
    dob: '1985-03-02',
    occupation: 'ঠিকাদার',
    presentAddress: 'গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    permanentAddress: 'গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    gender: 'male'
  },
  36: {
    nameEn: 'MD. SURUJ ALI',
    fatherName: 'মাহতাব উদ্দিন',
    motherName: 'আয়েশা',
    dob: '1975-01-01',
    occupation: 'ব্যবসা',
    presentAddress: 'গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    permanentAddress: 'গ্রামঃ পূর্ব দাপুনিয়া, পোঃ গৌরীপুর-২২৭০, থানাঃ গৌরীপুর, জেলাঃ ময়মনসিংহ',
    gender: 'male'
  },
  37: {
    nameEn: 'MD. ALOMGIR DEWAN',
    fatherName: 'মোঃ রমিজ উদ্দিন',
    motherName: 'আছিমা বেগম',
    dob: '1991-02-01',
    occupation: 'ঠিকাদার',
    presentAddress: 'বাসা/হোল্ডিং-০০, গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    permanentAddress: 'বাসা/হোল্ডিং-০০, গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    gender: 'male'
  },
  38: {
    nameEn: 'MOHAMMAD OLIULLAH',
    fatherName: 'মোহাম্মদ আবুল মালেক',
    motherName: 'জয়বাহার বেগম',
    dob: '1985-02-03',
    occupation: 'প্রবাসী',
    presentAddress: 'গ্রামঃ বাদালদী, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    permanentAddress: 'গ্রামঃ বাদালদী, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    gender: 'male'
  },
  39: {
    nameEn: 'MD. JALAL UDDIN',
    fatherName: 'মোঃ তৈনুছ আলী',
    motherName: 'জাহানারা বেগম',
    dob: '2000-01-01',
    occupation: 'ব্যবসা',
    presentAddress: 'গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    permanentAddress: 'গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    gender: 'male'
  },
  40: {
    nameEn: 'MD. KHOKON',
    fatherName: 'আব্দুছ ছাত্তার (চৌধুরী মিয়া)',
    motherName: 'জাহেদা খাতুন',
    dob: '1987-07-05',
    occupation: 'ব্যবসা',
    presentAddress: 'গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    permanentAddress: 'বাসা/হোল্ডিং-ওহাব হোসেন সওদাগর বাড়ী, গ্রামঃ চর ভূতা, পোঃ ভবানীগঞ্জ-৩৭০২, থানাঃ লক্ষ্মীপুর, জেলাঃ লক্ষ্মীপুর',
    gender: 'male'
  },
  41: {
    nameEn: 'IBRAHIM HOSSAIN',
    fatherName: 'আবুল হক',
    motherName: 'রোকেয়া খাতুন',
    dob: '1985-11-11',
    occupation: 'চাকুরীজীবী',
    presentAddress: 'গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    permanentAddress: 'গ্রামঃ ভুরুনিয়া, পোঃ ভুরুনিয়া-৯৪৫০, থানাঃ श्यामনগর, জেলাঃ সাতক্ষীরা',
    gender: 'male'
  },
  42: {
    nameEn: 'MD. BELAL HOSSAIN',
    fatherName: 'মোঃ শাহালম হোসেন',
    motherName: 'মৃত মমতাজ বেগম',
    dob: '1987-04-03',
    occupation: 'চাকুরীজীবী',
    presentAddress: 'গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    permanentAddress: 'গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    gender: 'male'
  },
  43: {
    nameEn: 'MAHABUBA AKTER',
    fatherName: 'মোঃ রিয়াজ উদ্দিন সরকার',
    motherName: 'ফরিদা আক্তার',
    dob: '2000-01-18',
    occupation: 'ছাত্রী',
    presentAddress: 'বাসা/হোল্ডিং-২৯, গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    permanentAddress: 'বাসা/হোল্ডিং-২৯, গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    gender: 'female'
  },
  44: {
    nameEn: 'TAMIJUDDIN',
    fatherName: 'আবেদ আলী দেওয়ান',
    motherName: 'রেজিয়া খাতুন',
    dob: '1963-03-07',
    occupation: 'চাকুরীজীবী',
    presentAddress: 'বাসা/হোল্ডিং-৩-বি, রাস্তাঃ ২, লেন-২, গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    permanentAddress: 'বাসা/হোল্ডিং-৩-বি, রাস্তাঃ ২, লেন-২, গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    gender: 'male'
  },
  45: {
    nameEn: 'MD NASIR',
    fatherName: 'আঃ ফজল মিয়া',
    motherName: 'মুজিবুন নেছা',
    dob: '1977-09-06',
    occupation: 'চাকুরীজীবী',
    presentAddress: 'গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    permanentAddress: 'বাসা/হোল্ডিং-১, সেক্টর-১, পোঃ উত্তরা-১২৩০, থানাঃ বিমান বন্দর, জেলাঃ ঢাকা',
    gender: 'male'
  },
  46: {
    nameEn: 'MD. SHAHADAT HOSSEN',
    fatherName: 'মোঃ বশির উদ্দিন',
    motherName: 'শাহনাজ হোসেন',
    dob: '1999-11-06',
    occupation: 'ছাত্র',
    presentAddress: 'গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    permanentAddress: 'গ্রামঃ গানধুরিয়া, পোঃ নগর কোন্ডা-১২১৬, থানাঃ সাভার, জেলাঃ ঢাকা',
    gender: 'male'
  },
  47: {
    nameEn: 'JAHANARA AKTER',
    fatherName: 'মোঃ খোরশেদ আলম',
    motherName: 'আয়েশা বেগম',
    dob: '1991-08-25',
    occupation: 'গৃহিণী',
    presentAddress: 'গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    permanentAddress: 'গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    gender: 'female'
  },
  48: {
    nameEn: 'MD FAIZUR RAHMAN KHAN',
    fatherName: 'আব্দুল আজিজ খান',
    motherName: 'জাহানারা বেগম',
    dob: '1972-08-19',
    occupation: 'চাকুরীজীবী',
    presentAddress: 'বাসা/হোল্ডিং-২, রাস্তা-১, গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    permanentAddress: 'বাসা/হোল্ডিং-২, রাস্তা-১, গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    gender: 'male'
  },
  49: {
    nameEn: 'RAMIJUDDIN',
    fatherName: 'আবেদ আলী দেওয়ান',
    motherName: 'রেজিয়া খাতুন',
    dob: '1970-03-05',
    occupation: 'চাকুরীজীবী',
    presentAddress: 'বাসা/হোল্ডিং-১, রাস্তাঃ ২,  ব্লক-বি, গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    permanentAddress: 'বাসা/হোল্ডিং-১, রাস্তাঃ ২,  ব্লক-বি, গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    gender: 'male'
  },
  50: {
    nameEn: 'ASLAM DEWAN',
    fatherName: 'রমিজ উদ্দিন',
    motherName: 'আসমা বেগম',
    dob: '1983-04-20',
    occupation: 'চাকুরীজীবী',
    presentAddress: 'গ্রামঃ উত্তর বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    permanentAddress: 'গ্রামঃ উত্তর বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    gender: 'male'
  },
  51: {
    nameEn: 'MD. SHFIKUL ISLAM',
    fatherName: 'চান মিয়া',
    motherName: 'অজিফা খাতুন',
    dob: '1969-02-12',
    occupation: 'ব্যবসা',
    presentAddress: 'বাসা/হোল্ডিং-৯, গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    permanentAddress: 'বাসা/হোল্ডিং-৯, গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    gender: 'male'
  },
  52: {
    nameEn: 'MD. LITON HOSSAIN',
    fatherName: 'মোঃ আইয়ুব আলী',
    motherName: 'নাসিমা বেগম',
    dob: '1988-02-14',
    occupation: 'ব্যবসা',
    presentAddress: 'গ্রামঃ উত্তর বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    permanentAddress: 'গ্রামঃ উত্তর বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    gender: 'male'
  },
  53: {
    nameEn: 'MARUF ALAM MRIDUL',
    fatherName: 'মাসুদ আলম',
    motherName: 'মাসুমা আক্তার ডলি',
    dob: '2006-07-05',
    occupation: 'ছাত্র',
    presentAddress: 'গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    permanentAddress: 'গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    gender: 'male'
  },
  54: {
    nameEn: 'SUKTA BEGUM',
    fatherName: 'মোস্তফা খোকন',
    motherName: 'আজিমা খাতুন',
    dob: '1989-01-01',
    occupation: 'গৃহিণী',
    presentAddress: 'গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    permanentAddress: 'গ্রামঃ গনু মিয়া সর্দার বাড়ী, গ্রামঃ অবির নগর, পোঃ লক্ষ্মীপুর-৩৭০০, থানাঃ লক্ষ্মীপুর সদর, জেলাঃ লক্ষ্মীপুর',
    gender: 'female'
  },
  55: {
    nameEn: 'MD. SUJON',
    fatherName: 'আবদুস সাত্তার চৌধুরী',
    motherName: 'জাহেদা বেগম',
    dob: '1991-03-13',
    occupation: 'প্রবাসী',
    presentAddress: 'গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    permanentAddress: 'গ্রামঃ ওহাব হোসেনের বাড়ী, গ্রামঃ চরভুতু, পোঃ ভবানীগঞ্জ-৩৭০২, থানাঃ লক্ষ্মীপুর সদর, জেলাঃ লক্ষ্মীপুর',
    gender: 'male'
  },
  56: {
    nameEn: 'MD SALIM AHAMED',
    fatherName: 'মোঃ সুলতান মিয়া',
    motherName: 'মোসাঃ ফুলবানু',
    dob: '1978-10-15',
    occupation: 'চাকুরীজীবী',
    presentAddress: 'বাসা/হোল্ডিং-৪২, লেন-৩,  ব্লক-এ, গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    permanentAddress: 'বাসা/হোল্ডিং-৪২, লেন-৩,  ব্লক-এ, গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    gender: 'male'
  },
  57: {
    nameEn: 'ABDUR RAJJAK',
    fatherName: 'আনছার আলী',
    motherName: 'তহুরা খাতুন',
    dob: '1973-03-19',
    occupation: 'ব্যবসা',
    presentAddress: 'বাসা/হোল্ডিং-১৫/৪, রাস্তা-২, গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    permanentAddress: 'বাসা/হোল্ডিং-১৫/৪, রাস্তা-২, গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    gender: 'male'
  },
  58: {
    nameEn: 'FATEMA BEGUM',
    fatherName: 'মোঃ করম আলী',
    motherName: 'আমেনা খাতুন',
    dob: '1966-02-05',
    occupation: 'গৃহিণী',
    presentAddress: 'বাসা/হোল্ডিং-২২, গ্রামঃ উত্তর বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    permanentAddress: 'বাসা/হোল্ডিং-২২, gram: উত্তর বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    gender: 'female'
  },
  59: {
    nameEn: 'NAZMUL HUDA',
    fatherName: 'আব্দুল জলিল মোল্লা',
    motherName: 'ফজিলাতুন নেছা',
    dob: '1971-06-01',
    occupation: 'চাকুরীজীবী',
    presentAddress: 'গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    permanentAddress: 'গ্রামঃ চরদিয়াটা, পোঃ পাতারচর-৮২৫০, থানাঃ মুলাদী, জেলাঃ বরিশাল',
    gender: 'male'
  },
  60: {
    nameEn: 'ADNAN JAIDY',
    fatherName: 'নাজমুল হুদা',
    motherName: 'মার্জিয়া হুদা',
    dob: '2001-06-04',
    occupation: 'ছাত্র',
    presentAddress: 'গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    permanentAddress: 'গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    gender: 'male'
  },
  61: {
    nameEn: 'MD HAZRAT ALI',
    fatherName: 'মোঃ তোয়াজ উদ্দিন',
    motherName: 'মোসাঃ ছবিরন নেছা',
    dob: '1980-02-22',
    occupation: 'ব্যবসা',
    presentAddress: 'গ্রামঃ উত্তর বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    permanentAddress: 'গ্রামঃ উত্তর বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    gender: 'male'
  },
  62: {
    nameEn: 'MD DOULAT HOSSAIN',
    fatherName: 'দুলাল মিয়া',
    motherName: 'জবেদা খাতুন',
    dob: '1963-08-11',
    occupation: 'ব্যবসা',
    presentAddress: 'গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    permanentAddress: 'গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    gender: 'male'
  },
  63: {
    nameEn: 'HARUN OR RASHID',
    fatherName: 'মোঃ রেজাউল করিম',
    motherName: 'হনুফা',
    dob: '1997-01-01',
    occupation: 'চাকুরীজীবী',
    presentAddress: 'গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    permanentAddress: 'গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    gender: 'male'
  },
  64: {
    nameEn: 'MD. FIROZ MIAH',
    fatherName: 'মোঃ মজিবর রহমান',
    motherName: 'ফিরোজা বেগম',
    dob: '1997-11-30',
    occupation: 'চাকুরীজীবী',
    presentAddress: 'গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    permanentAddress: 'গ্রামঃ দক্ষিণ পাড়া, নলিন, পোঃ হেমনগর-১৯৯২, থানাঃ গোপালপুর, জেলাঃ টাঙ্গাইল',
    gender: 'male'
  },
  65: {
    nameEn: 'MD. MAHAMUD MIA',
    fatherName: 'মোঃ মান্নান মিয়া',
    motherName: 'মোসাঃ মাকছুদা বেগম',
    dob: '1999-10-10',
    occupation: 'ব্যবসা',
    presentAddress: 'গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    permanentAddress: 'গ্রামঃ ইসলামপুর, পোঃ পায়রাবন্দ-৫৪৬০, থানাঃ মিঠাপুকুর, জেলাঃ রংপুর',
    gender: 'male'
  },
  66: {
    nameEn: 'MD. RANAL HOSSAIN KHAN',
    fatherName: 'নাসির উদ্দিন খান',
    motherName: 'ফাতেমা বেগম',
    dob: '1994-12-31',
    occupation: 'চাকুরীজীবী',
    presentAddress: 'গ্রামঃ ফোজর বাড়ী, উত্তর খান, পোঃ উজামপুর-১২৩০, থানাঃ উত্তর খান, জেলাঃ ঢাকা',
    permanentAddress: 'গ্রামঃ ফোজর বাড়ী, উত্তর khan, পোঃ উজামপুর-১২৩০, থানাঃ উত্তর খান, জেলাঃ ঢাকা',
    gender: 'male'
  },
  67: {
    nameEn: 'MD. MAHBUBUR RAHMAN',
    fatherName: 'মোঃ মিজানুর রহমান',
    motherName: 'মিসেস ফজিলাতুননেছা',
    dob: '1971-12-11',
    occupation: 'চাকুরীজীবী',
    presentAddress: 'গ্রামঃ মোল্লার টেক, পোঃ মোল্লার টেক-১২৩০, থানাঃ দক্ষিণখান, জেলাঃ ঢাকা',
    permanentAddress: 'গ্রামঃ মোল্লার টেক, পোঃ মোল্লার টেক-১২৩০, থানাঃ দক্ষিণখান, জেলাঃ ঢাকা',
    gender: 'male'
  },
  68: {
    nameEn: 'MD. FARUCK HOSSAIN',
    fatherName: 'মোঃ দুলাল হোসেন',
    motherName: 'মোসাঃ ফাতেমা বেগম',
    dob: '1984-12-20',
    occupation: 'ব্যবসা',
    presentAddress: 'বাসা/হোল্ডিং-৬২, গ্রামঃ উত্তরখান, ভূইয়া বাড়ী, পোঃ উত্তরখান -১২৩০, থানাঃ উত্তরখান, জেলাঃ ঢাকা',
    permanentAddress: 'বাসা/হোল্ডিং-৬২, গ্রামঃ উত্তরখান, ভূইয়া বাড়ী, পোঃ উত্তরখান -১২৩০, থানাঃ উত্তরখান, জেলাঃ ঢাকা',
    gender: 'male'
  },
  69: {
    nameEn: 'MD. SUMON',
    fatherName: 'মোঃ শহর আলী',
    motherName: 'মোর্শেদা',
    dob: '2001-01-01',
    occupation: 'চাকুরীজীবী',
    presentAddress: 'বাসা/হোল্ডিং- ৫৩, গ্রামঃ ফরিদ মার্কেট পুরাককের, পোঃ আজমপুর-১২৩০, থানাঃ দক্ষিণখান, জেলাঃ ঢাকা',
    permanentAddress: 'বাসা/হোল্ডিং- ৫৩, গ্রামঃ ফরিদ মার্কেট পুরাককের, পোঃ আজমপুর-১২৩০, থানাঃ দক্ষিণখান, জেলাঃ ঢাকা',
    gender: 'male'
  },
  70: {
    nameEn: 'MD. ROBIUL ISLAM RONY',
    fatherName: 'মোঃ আঃ রব আকন',
    motherName: 'নার্গিস বেগম',
    dob: '1997-09-01',
    occupation: 'চাকুরীজীবী',
    presentAddress: 'গ্রামঃ সরকার বাড়ী রোড, পুরাকৈর, পোঃ আজমপুর-১২৩০, থানাঃ দক্ষিণখান, জেলাঃ ঢাকা',
    permanentAddress: 'গ্রামঃ সরকার বাড়ী রোড, পুরাকৈর, পোঃ আজমপুর-১২৩০, থানাঃ দক্ষিণখান, জেলাঃ ঢাকা',
    gender: 'male'
  },
  71: {
    nameEn: 'PIPLU KARMAKAR',
    fatherName: 'কানাই কর্মকার',
    motherName: 'মিরা রানী কর্মকার',
    dob: '1989-04-14',
    occupation: 'চাকুরীজীবী',
    presentAddress: 'গ্রামঃ প্রেমবাগান, পোঃ দক্ষিণখান-১২৩০, থানাঃ দক্ষিণখান, জেলাঃ ঢাকা',
    permanentAddress: 'বাসা/হোল্ডিং- দাউদকান্দি, পোঃ দাউদকান্দি -৩৫১৬, থানাঃ দাউদকান্দি, জেলাঃ কুমিল্লা',
    gender: 'male'
  },
  72: {
    nameEn: 'MD ISHAK MIA',
    fatherName: 'মোঃ জাবেদ আলী',
    motherName: 'মোসাঃ সুফিয়া বেগম',
    dob: '1974-04-02',
    occupation: 'ব্যবসা',
    presentAddress: 'গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    permanentAddress: 'বাসাঃ ১৯-বি, রাস্তাঃ ১০, গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    gender: 'male'
  },
  73: {
    nameEn: 'MD AZAHAR ALI',
    fatherName: 'বাচ্চু মিয়া',
    motherName: 'ফুল বানু',
    dob: '1980-06-20',
    occupation: 'ব্যবসা',
    presentAddress: 'বাসা/হোল্ডিং-২৪, রাস্তাঃ ০৪, গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    permanentAddress: 'বাসা/হোল্ডিং-২৪, রাস্তাঃ ০৪, গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    gender: 'male'
  },
  74: {
    nameEn: 'SHILA',
    fatherName: 'মোঃ শহিদ',
    motherName: 'মোসাঃ শাবানা আক্তার',
    dob: '1988-01-01',
    occupation: 'গৃহিণী',
    presentAddress: 'গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    permanentAddress: 'গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    gender: 'female'
  },
  75: {
    nameEn: 'NAFISA SADAF',
    fatherName: 'মোহাম্মদ নাজমুল হোসাইন',
    motherName: 'ফারহানা বেগম',
    dob: '2013-08-30',
    occupation: 'ছাত্রী',
    presentAddress: 'গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    permanentAddress: 'বাসা/হোল্ডিং-শহিদ উল্যাহ ভেন্ডার এর বাড়ী, গ্রামঃ হারানিয়া, পোঃ বক্তার হাট-৪৩০০, থানাঃ সন্দ্বীপ, জেলাঃ চট্টগ্রাম',
    gender: 'female'
  },
  76: {
    nameEn: 'MAHMUDA AKTER',
    fatherName: 'মোঃ ফারুক আজম',
    motherName: 'ফাতেমা খাতুন',
    dob: '1998-09-21',
    occupation: 'গৃহিণী',
    presentAddress: 'বাসা/হোল্ডিং- ৫/৩, গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    permanentAddress: 'বাসা/হোল্ডিং- ৫/৩, গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    gender: 'female'
  },
  77: {
    nameEn: 'MD. KAWSER',
    fatherName: 'হাজী আব্দুর রহিম',
    motherName: 'পিয়ারা বেগম',
    dob: '1987-11-19',
    occupation: 'ব্যবসা',
    presentAddress: 'বাসা/হোল্ডিং-১৪, গ্রাম/রাস্তাঃ ৩, সেক্টর-৩, পোঃ উত্তরা-১২৩০, থানাঃ উত্তরা, জেলাঃ ঢাকা',
    permanentAddress: 'গ্রামঃ মুচাগড়া, পোঃ যাত্রাপুর-৩৫৪০, থানাঃ মুরাদনগর, জেলাঃ কুমিল্লা',
    gender: 'male'
  },
  78: {
    nameEn: 'MST. KOLPONA KHATUN',
    fatherName: '—',
    motherName: 'মোসাঃ রাফেজা বেগম',
    dob: '1990-03-06',
    occupation: 'গৃহিণী',
    presentAddress: 'বাসা/হোল্ডিং-১৪, gram/রাস্তাঃ ৩, সেক্টর-৩, পোঃ উত্তরা-১২৩০, থানাঃ উত্তরা, জেলাঃ ঢাকা',
    permanentAddress: 'গ্রামঃ মুচাগড়া, পোঃ যাত্রাপুর-৩৫৪০, থানাঃ মুরাদনগর, জেলাঃ কুমিল্লা',
    gender: 'female'
  },
  79: {
    nameEn: 'MD. REZAUL',
    fatherName: '—',
    motherName: 'মোসাঃ সালেহা খাতুন',
    dob: '1983-08-01',
    occupation: 'ব্যবসা',
    presentAddress: 'গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    permanentAddress: 'বাসা/হোল্ডিং-৭০৫/৬, গ্রামঃ দক্ষিণ কদমতলা, পোঃ দক্ষিণ কদমতলা-৯৩৩০, থানাঃ শরণখোলা, জেলাঃ বাগেরহাট',
    gender: 'male'
  },
  80: {
    nameEn: 'MD. MILON HOWLADER',
    fatherName: 'আঃ ছালাম হাওলাদার',
    motherName: 'নুপুর',
    dob: '1987-03-16',
    occupation: 'চাকুরীজীবী',
    presentAddress: 'গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    permanentAddress: 'বাসা/হোল্ডিং-বিসিক রোড, গ্রামঃ কাউনিয়া, পোঃ বরিশাল-৮২০০, থানাঃ বরিশাল সদর, জেলাঃ বরিশাল',
    gender: 'male'
  },
  81: {
    nameEn: 'MD. SOHEL CHOWDHURY',
    fatherName: 'আব্দুল হাকিম চৌধুরী',
    motherName: 'মৃত মমিলা খাতুন',
    dob: '1984-01-01',
    occupation: 'ব্যবসা',
    presentAddress: 'বাসা/হোল্ডিং-৫তন, গ্রামঃ নেমতাবাদ, পোঃ নেমতাবাদ-৩৪৬৪, থানাঃ কসবা, জেলাঃ ব্রাহ্মণবাড়িয়া',
    permanentAddress: 'বাসা/হোল্ডিং-৫৩৫, গ্রামঃ নেমতাবাদ, পোঃ নেমতাবাদ-৩৪৬৪, থানাঃ কসবা, জেলাঃ ব্রাহ্মণবাড়িয়া',
    gender: 'male'
  },
  82: {
    nameEn: 'FARHAN SADIQ TAHMID',
    fatherName: 'মোঃ মাসুদ মিয়া',
    motherName: 'লাইলী আক্তার',
    dob: '2016-02-22',
    occupation: 'ছাত্র',
    presentAddress: 'বাসা/হোল্ডিং-৩৩, বাউনিয়া মেইন রোড, গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    permanentAddress: 'বাসা/হোল্ডিং-৩৩, বাউনিয়া মেইন রোড, গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    gender: 'male'
  },
  83: {
    nameEn: 'ZAKIA SULTANA',
    fatherName: 'মোঃ আঃ জব্বার',
    motherName: 'ফাতেমা বেগম',
    dob: '1988-10-12',
    occupation: 'গৃহিণী',
    presentAddress: 'বাসা/হোল্ডিং-২২, বাউনিয়া মেইন রোড, গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    permanentAddress: 'বাসা/হোল্ডিং-২২, বাউনিয়া মেইন রোড, গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    gender: 'female'
  },
  84: {
    nameEn: 'MD. SHAHIDUL ISKANDAR',
    fatherName: 'আব্দুল কাইয়ুম',
    motherName: 'দীপালী বেগম',
    dob: '1976-02-20',
    occupation: 'চাকুরীজীবী',
    presentAddress: 'বাসা/হোল্ডিং-১৫৫, গ্রামঃ মধ্য আজমপুর, পোঃ আজমপুর-১২৩০, থানাঃ দক্ষিণখান, জেলাঃ ঢাকা',
    permanentAddress: 'বাসা/হোল্ডিং-১৫৫, গ্রামঃ মধ্য আজমপুর, পোঃ আজমপুর-১২৩০, থানাঃ দক্ষিণখান, জেলাঃ ঢাকা',
    gender: 'male'
  },
  85: {
    nameEn: 'ABDUL HAKIM',
    fatherName: 'মোঃ লাবু মিয়া',
    motherName: 'হালিমা',
    dob: '1982-12-31',
    occupation: 'ব্যবসা',
    presentAddress: 'বাসা/হোল্ডিং- ৪, রাস্তা-২, গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    permanentAddress: 'বাসা/হোল্ডিং- ৪, রাস্তা-২, গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    gender: 'male'
  },
  86: {
    nameEn: 'MD MOKHTARUZZAMAN',
    fatherName: 'মোঃ আব্দুস ছাত্তার',
    motherName: 'মোসাঃ আসমনা বেগম',
    dob: '1987-12-15',
    occupation: 'চাকুরীজীবী',
    presentAddress: 'গ্রামঃ বেড়াকুটি, পোঃ বেড়াকুটি-৫৩০০, থানাঃ নীলফামারী সদর, জেলাঃ নীলফামারী',
    permanentAddress: 'গ্রামঃ বেড়াকুটি, পোঃ বেড়াকুটি-৫৩০০, থানাঃ নীলফামারী সদর, জেলাঃ নীলফামারী',
    gender: 'male'
  },
  87: {
    nameEn: 'ABDUL KADIR',
    fatherName: 'মোঃ আহাসান উল্লাহ মিয়া',
    motherName: 'মোসাঃ সাজেদা বেগম',
    dob: '1977-07-04',
    occupation: 'চাকুরীজীবী',
    presentAddress: 'গ্রামঃ পোয়ালপাড়া, পোঃ পরশিনগর-১৪৬০, থানাঃ রূপগঞ্জ, জেলাঃ নারায়ণগঞ্জ',
    permanentAddress: 'গ্রামঃ গোয়ালপাড়া, পোঃ পরশিনগর-১৪৬০, থানাঃ রূপগঞ্জ, জেলাঃ নারায়ণগঞ্জ',
    gender: 'male'
  },
  88: {
    nameEn: 'MD. ABDUL KARIM',
    fatherName: 'মোঃ আকবর হোসেন',
    motherName: 'নুরজাহান বেগম',
    dob: '1992-01-04',
    occupation: 'চাকুরীজীবী',
    presentAddress: 'গ্রামঃ আবাদিুর, পোঃ আবাদিুর-১৯১৩, থানাঃ দেলদুয়ার, জেলাঃ টাঙ্গাইল',
    permanentAddress: 'গ্রামঃ আবাদিুর, পোঃ আবাদিুর-১৯১৩, থানাঃ দেলদুয়ার, জেলাঃ টাঙ্গাইল',
    gender: 'male'
  },
  89: {
    nameEn: 'MST. LOPA AKTER RIMI',
    fatherName: 'সিকিম আলী',
    motherName: 'দেলোয়ারা বেগম',
    dob: '1993-06-14',
    occupation: 'গৃহিণী',
    presentAddress: 'গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    permanentAddress: 'গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    gender: 'female'
  },
  90: {
    nameEn: 'MD KAMAL HOSSAIN',
    fatherName: 'মোঃ জহির আলী',
    motherName: 'মোসাঃ মোনায়েরা বেগম',
    dob: '1977-09-01',
    occupation: 'ব্যবসা',
    presentAddress: 'গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    permanentAddress: 'বাসা/হোল্ডিং- ২৩৩, গ্রামঃ আজমপুর, শাহকবির মাজার রোড, পোঃ আজমপুর-১২৩০, থানাঃ দক্ষিণখান, জেলাঃ ঢাকা',
    gender: 'male'
  },
  91: {
    nameEn: 'MD. FORMAN HOSSAIN',
    fatherName: 'ফজলুল হক',
    motherName: 'মোসাঃ মিলন বেগম',
    dob: '1981-05-01',
    occupation: 'প্রবাসী',
    presentAddress: 'বাসা/হোল্ডিং-১০, gram: বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    permanentAddress: 'বাসা/হোল্ডিং-১০, গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    gender: 'male'
  },
  92: {
    nameEn: 'MD. ABDULLAH AL MAMUN',
    fatherName: 'মোঃ আঃ মতিন',
    motherName: 'হালিমা খাতুন',
    dob: '1995-12-30',
    occupation: 'চাকুরীজীবী',
    presentAddress: 'বাসা/হোল্ডিং-৪,  ব্লক-এ, রাস্তাঃ ৪, গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    permanentAddress: 'বাসা/হোল্ডিং-৪,  ব্লক-এ, রাস্তাঃ ৪, গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    gender: 'male'
  },
  93: {
    nameEn: 'ABU BAKKAR SIDDIK',
    fatherName: 'মোজাফফর হোসেন',
    motherName: 'আসমা বেগম',
    dob: '1984-12-04',
    occupation: 'ব্যবসা',
    presentAddress: 'বাসা/হোল্ডিং-২৭, রাস্তাঃ মেইন রোড, গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    permanentAddress: 'বাসা/হোল্ডিং-২৭, রাস্তাঃ মেইন রোড, গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    gender: 'male'
  },
  94: {
    nameEn: 'MD. SHAMSUL HAQUE',
    fatherName: 'মোঃ মোকেশত আলী',
    motherName: 'আফিয়া খাতুন',
    dob: '1971-01-01',
    occupation: 'ব্যবসা',
    presentAddress: 'বাসা/হোল্ডিং- ৫৪, লেন-৩,  ব্লক-এ, গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    permanentAddress: 'বাসা/হোল্ডিং- ৫৪, লেন-৩,  ব্লক-এ, গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    gender: 'male'
  },
  95: {
    nameEn: 'MD. AL-MAMUN',
    fatherName: 'মোঃ ফারুক আজম',
    motherName: 'মোসাঃ ফাতেমা খাতুন',
    dob: '1993-01-01',
    occupation: 'ডাক্তার',
    presentAddress: 'গ্রামঃ সাফাইশ্রী, পোঃ কাপাসিয়া-১৭৩০, থানাঃ কাপাসিয়া, জেলাঃ গাজীপুর',
    permanentAddress: 'গ্রামঃ সাফাইশ্রী, পোঃ কাপাসিয়া-১৭৩০, থানাঃ কাপাসিয়া, জেলাঃ গাজীপুর',
    gender: 'male'
  },
  96: {
    nameEn: 'MD BABU MIA',
    fatherName: 'মোঃ মজিবর রহমান',
    motherName: 'মোসাঃ নুরজাহান',
    dob: '1971-11-05',
    occupation: 'ব্যবসা',
    presentAddress: 'বাসা/হোল্ডিং-২৪-এ, রাস্তাঃ ৪, গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    permanentAddress: 'বাসা/হোল্ডিং-২৪-এ, রাস্তাঃ ৪, গ্রামঃ বাউনিয়া, পোঃ বাদালদী-১২৩০, থানাঃ তুরাগ, জেলাঃ ঢাকা',
    gender: 'male'
  }
};

export const generateMembersFromRaw = (): Member[] => {
  return rawMembersList.map((m) => {
    const formattedId = `BB-${String(m.no).padStart(3, '0')}`;
    const sharePrice = 100000;
    const totalShareValue = m.shareQty * sharePrice;

    const details = memberExtDetails[m.no] || {
      nameEn: `Member ${m.no}`,
      fatherName: '—',
      motherName: '—',
      dob: '1985-01-01',
      occupation: 'ব্যবসায়ী',
      presentAddress: 'বাউনিয়া, তুরাগ, ঢাকা-১২৩০',
      permanentAddress: 'বাউনিয়া, তুরাগ, ঢাকা',
      gender: 'male'
    };

    const nomineeDetails = nomineeExtDetails[m.no] || {
      name: m.nomineeName,
      relation: 'নমিনী',
      nidBirthReg: m.nomineeNid,
      mobile: m.mobile
    };

    return {
      id: formattedId,
      memberNo: m.no,
      nameBn: m.nameBn,
      nameEn: details.nameEn,
      fatherName: details.fatherName,
      motherName: details.motherName,
      spouseName: '',
      dob: details.dob,
      gender: details.gender,
      nid: m.nid || `NID-${m.no}`,
      mobile: m.mobile,
      occupation: details.occupation,
      presentAddress: details.presentAddress,
      permanentAddress: details.permanentAddress,
      religion: (details as any).religion || 'ইসলাম',
      nationality: (details as any).nationality || 'বাংলাদেশী',
      joinDate: m.no >= 1 && m.no <= 76 ? '2025-11-01' : (m.no >= 77 && m.no <= 96 ? '2026-08-01' : '2026-01-01'),
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
          name: nomineeDetails.name,
          relation: nomineeDetails.relation,
          nidBirthReg: nomineeDetails.nidBirthReg,
          mobile: nomineeDetails.mobile,
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
