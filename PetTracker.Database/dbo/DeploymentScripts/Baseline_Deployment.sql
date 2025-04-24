merge Companies as T
using (
	 values 
		('Cut And Dry Pet Salon','00001'),
		('Sonora Pet Care','000002'),
		('Abril''s Paw Spa','00003'),
		('Furry Land Of Pheonix','00004')
) as S ([Name], CompanyCode)
on T.[Name] = S.[Name]
when not matched then
insert ([Name])
	values (S.[Name], S.CompanyCode)
when matched then update set
	 T.CompanyCode = S.CompanyCode;


merge PetTypes as T
using (
	 values (1,'Dog')
	 ,(2,'Cat')
	 ,(3,'Fish')
	 ,(4,'Bird')
	 ,(5,'Reptile')
) as S (Id,[Name])
on T.Id = S.Id
when not matched then
insert ([Name])
	values (S.[Name])
when matched then update set
	T.[Name] = S.[Name];

--dog breed types
merge BreedTypes as T
using (
	 values 
		(1,1,'Airedale Terrier'),
		(2,1,'Akita'),
		(3,1,'Alaskan Malamute'),
		(4,1,'American Bulldog '),
		(5,1,'American Bully (Standard)'),
		(6,1,'American Eskimo Dog (Miniature)'),
		(7,1,'American Eskimo Dog (Standard)'),
		(8,1,'Am. Staffordshire Terrier'),
		(9,1,'American Pit Bull Terrier'),
		(10,1,'Australian Cattle Dog (Heeler)'),
		(11,1,'Australian Kelpie'),
		(12,1,'Australian Shepherd'),
		(13,1,'Austrialian Terrier'),
		(14,1,'Barbet'),
		(15,1,'Basenji'),
		(16,1,'Basset Hound'),
		(17,1,'Beagle'),
		(18,1,'Beauceron'),
		(19,1,'Bedlington Terrier'),
		(20,1,'Belgian Malinois'),
		(21,1,'Belgian Tervuren'),
		(22,1,'Bernese Mountain Dog'),
		(23,1,'Bichon Frise'),
		(24,1,'Black and Tan Coonhound'),
		(25,1,'Bloodhound'),
		(26,1,'Bluetick Coonhound'),
		(27,1,'Boerboel'),
		(28,1,'Border Collie'),
		(29,1,'Border Terrier'),
		(30,1,'Boston Terrier'),
		(31,1,'Bouvier des Flandres'),
		(32,1,'Boxer'),
		(33,1,'Boykin Spaniel'),
		(34,1,'Bracco Italiano '),
		(35,1,'Briard'),
		(36,1,'Brittany'),
		(37,1,'Bull Terrier (Standard)'),
		(38,1,'Bull Terrier (Miniature)'),
		(39,1,'Bulldog'),
		(40,1,'Bullmastiff'),
		(41,1,'Cairn Terrier'),
		(42,1,'Cane Corso'),
		(43,1,'Cardigan Welsh Corgi'),
		(44,1,'Catahoula Leopard Dog'),
		(45,1,'Caucasian Shepherd (Ovcharka)'),
		(46,1,'Cavalier King Charles Spaniel'),
		(47,1,'Chesapeake Bay Retriever'),
		(48,1,'Chihuahua (Long hair)'),
		(49,1,'Chihuahua (Smooth)'),
		(50,1,'Chinese Crested'),
		(51,1,'Chinese Shar-Pei'),
		(52,1,'Chinook'),
		(53,1,'Chow Chow'),
		(54,1,'Clumber Spaniel'),
		(55,1,'Cocker Spaniel (American)'),
		(56,1,'Cocker Spaniel (English)'),
		(57,1,'Collie (Smooth)'),
		(58,1,'Collie (Rough)'),
		(59,1,'Coton De Tulear'),
		(60,1,'Dachshund (smooth)'),
		(61,1,'Dachshund (wire/long haired)'),
		(62,1,'Dalmatian'),
		(63,1,'Doberman Pinscher'),
		(64,1,'Dogo Argentino'),
		(65,1,'Dutch Shepherd'),
		(66,1,'English Setter'),
		(67,1,'English Shepherd'),
		(68,1,'English Springer Spaniel'),
		(69,1,'English Toy Spaniel'),
		(70,1,'English Toy Terrier'),
		(71,1,'Eurasier'),
		(72,1,'Field Spaniel'),
		(73,1,'Finnish Lapphund'),
		(74,1,'Finnish Spitz'),
		(75,1,'Flat Coat Retriever'),
		(76,1,'French Bulldog'),
		(77,1,'German Pinscher'),
		(78,1,'German Shepherd Dog'),
		(79,1,'German Shorthaired Pointer'),
		(80,1,'Giant Schnauzer'),
		(81,1,'Glen of Imaal Terrier'),
		(82,1,'Golden Retriever'),
		(83,1,'Gordon Setter'),
		(84,1,'Great Dane'),
		(85,1,'Great Pyrenees'),
		(86,1,'Greyhound'),
		(87,1,'Harrier'),
		(88,1,'Havanese'),
		(89,1,'Irish Setter'),
		(90,1,'Irish Terrier'),
		(91,1,'Irish Wolfhound'),
		(92,1,'Italian Greyhound'),
		(93,1,'Japanese Chin'),
		(94,1,'Japanese Spitz'),
		(95,1,'Keeshond'),
		(96,1,'Komondor'),
		(97,1,'Kooikerhondje'),
		(98,1,'Kuvasz'),
		(99,1,'Labrador Retriever'),
		(100,1,'Lagotto Romagnolo'),
		(101,1,'Lancashire Heeler'),
		(102,1,'Leonberger'),
		(103,1,'Lhasa Apso'),
		(104,1,'Maltese'),
		(105,1,'Miniature American Shepherd'),
		(106,1,'Miniature Pinscher'),
		(107,1,'Miniature Schnauzer'),
		(108,1,'Newfoundland'),
		(109,1,'Norfolk Terrier'),
		(110,1,'Norwich Terrier'),
		(111,1,'Nova Scotia Duck Tolling Retriever'),
		(112,1,'Olde English Bulldogge'),
		(113,1,'Old English Sheepdog'),
		(114,1,'Papillon'),
		(115,1,'Parson Russell Terrier'),
		(116,1,'Patterdale Terrier (Smooth or Broken)'),
		(117,1,'Patterdale Terrier (Rough)'),
		(118,1,'Pekingese'),
		(119,1,'Pembroke Welsh Corgi'),
		(120,1,'Pharaoh Hound'),
		(121,1,'Plott'),
		(122,1,'Pointer (English)'),
		(123,1,'Pomeranian'),
		(124,1,'Poodle (Miniature)'),
		(125,1,'Poodle (Standard)'),
		(126,1,'Poodle (Toy)'),
		(127,1,'Portugese Water Dog'),
		(128,1,'Presa Canario'),
		(129,1,'Pug'),
		(130,1,'Puli'),
		(131,1,'Pumi'),
		(132,1,'Rat Terrier'),
		(133,1,'Redbone Coonhound'),
		(134,1,'Rhodesian Ridgeback'),
		(135,1,'Rottweiler'),
		(136,1,'Russian Toy'),
		(137,1,'Saluki'),
		(138,1,'Samoyed'),
		(139,1,'Schipperke'),
		(140,1,'Scottish Deerhound'),
		(141,1,'Scottish Terrier'),
		(142,1,'Shetland Sheepdog (Sheltie)'),
		(143,1,'Shiba Inu'),
		(144,1,'Shih Tzu'),
		(145,1,'Shiloh Shepherd'),
		(146,1,'Siberian Husky'),
		(147,1,'Silky Terrier'),
		(148,1,'Smooth Fox Terrier'),
		(149,1,'Soft Coated Wheaten Terrier'),
		(150,1,'Spanish Water Dog'),
		(151,1,'Spinone Italiano'),
		(152,1,'St. Bernard'),
		(153,1,'Staffordshire Bull Terrier'),
		(154,1,'Standard Schnauzer'),
		(155,1,'Swedish Vallhund '),
		(156,1,'Thai Ridgeback'),
		(157,1,'Tibetan Mastiff'),
		(158,1,'Tibetan Spaniel'),
		(159,1,'Tibetan Terrier'),
		(160,1,'Toy Fox Terrier'),
		(161,1,'Treeing Walker Coonhound'),
		(162,1,'Vizsla'),
		(163,1,'Weimaraner'),
		(164,1,'Welsh Springer Spaniel'),
		(165,1,'West Highland White Terrier'),
		(166,1,'Whippet'),
		(167,1,'White Shepherd '),
		(168,1,'Wire Fox Terrier'),
		(169,1,'Wirehaired Pointing Griffon'),
		(170,1,'Xoloitzcuintli'),
		(171,1,'Yorkshire Terrier')
) as S (Id,[PetTypeId],[Name])
on T.Id = S.Id
when not matched then
insert ([PetTypeId],[Name])
	values (S.[PetTypeId],S.[Name])
when matched then update set
	T.[PetTypeId] = S.[PetTypeId]
	,T.[Name] = S.[Name];

--cat breed types
