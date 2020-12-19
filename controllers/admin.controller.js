// jshint esversion:8
const debug = require('debug')('app:admin-controller');
const { Candidate } = require('../models/candidate.model');
const { User } = require('../models/user.model');
const { Position } = require('../models/position.model');
const { CandidatePosition } = require('../models/candidatePostion.model');
const { VoteCount } = require('../models/voteCountModel');
const { Admin } = require('../models/admin.model');
const createError = require('http-errors');
const formidable = require('formidable');
const { nanoid } = require('nanoid');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

const users = [
	{
		"matNo": "2017/6091",
		"name": "KPAMOR SAMUEL MSUGHTER",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2019/8116",
		"name": "FATINIKUN OLUWAPELUMI PETER",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2019/8140",
		"name": "EGBODO SAMUEL EBIBI",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2019/8142",
		"name": "AKOMOLAFE IFEOLUWA ANTHONY",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2019/8143",
		"name": "ETURHOBORE EJIROGHENE JESSE",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2019/8155",
		"name": "LEKE OLUWADARA DEBORAH",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2019/8156",
		"name": "COKER TOLULOPE MICHEAL",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2019/8170",
		"name": "MOSOBALAJE FAWAZ AYOMIDE",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2019/8195",
		"name": "ADEFEMI ENIOLA AKOREDE",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2019/8201",
		"name": "DADA OLUWADOYINSOLAMI OPEMIPO",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2019/8206",
		"name": "OLASOGBA BENJAMIN",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2019/8245",
		"name": "FAJUYIGBE JOSEPH BABAJIDE",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2019/8251",
		"name": "AKINBOHUNJE OLUWADAMISI DORCAS",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2019/8252",
		"name": "NYONG DOMINIC DOMINIC",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2019/8263",
		"name": "ONU GIFT UREDOJO",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2019/8271",
		"name": "ONYEWUCHI KELVIN CHUKWUEMEKA",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2019/8277",
		"name": "SULE VICTORIA SOKOLAYAM",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2019/8304",
		"name": "AKINYEMI FAITH TOLUWANI",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2019/8317",
		"name": "EWILI DANIEL JOHNSON",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2019/8332",
		"name": "JOHN COVENANT AMOS",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2019/8335",
		"name": "OYELOWO-OTEPOLA TOBILOBA ZEPHANIAH",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2019/8337",
		"name": "ADU OREOLUWA CALEB",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2019/8350",
		"name": "OYELOWO MUBARAK MOBOLAJI",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2019/8360",
		"name": "OLUPITAN TOLUWALASE DAVID",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2019/8373",
		"name": "BANKOLE KOFOWOROLA MOYOSOREOLUWA",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2019/8381",
		"name": "OJUKWU  PETER OLISAEMEKA",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2019/8384",
		"name": "ADEWUMI JACOB OLUROTIMI",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2019/8385",
		"name": "OGUNLENDE TIJANI BABATUNDE",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2019/8397",
		"name": "GARBRAH TEMILOLUWA MARK",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2019/8400",
		"name": "NNABUOGOR  IKEM MITCHELL",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2019/8451",
		"name": "ONEMU RUKEVWE JEFFREY",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2019/8481",
		"name": "BADMUS  HADI MOYOSORE ",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2019/8483",
		"name": "AJIBOLA NATHANIEL ABIOLA",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2019/8488",
		"name": "MBONUIKE UCHECHUKWU CHIEMELUM",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2019/8528",
		"name": "AKABA IKOR-ISHOR FRANK",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2019/8529",
		"name": "ADEYERI OLUWAKOREDE ADEOTI",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2019/8532",
		"name": "EDEH CHUKWUDUBEM MITCHEL",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2019/8544",
		"name": "ONYEMAIZU FAVOUR NENUBARI",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2019/8551",
		"name": "AREMU OLATUNDE GABRIEL",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2019/8567",
		"name": "ADENIJI ADEDOYIN SAMUEL",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2019/8583",
		"name": "ADEGUNWA EYIMOFE SALEEM",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2019/8624",
		"name": "KALU ELIZABETH EZICHUKWU ",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2019/8629",
		"name": "ELO-FRANCIS OGHENEMAERO BERNHARD",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2019/8636",
		"name": "ILORI ABOLAJI OPEYEMI",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2019/8664",
		"name": "AKPAN CALEB DAVIDSON",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2019/8667",
		"name": "AWOJOBI DANIEL OLUSEGUN",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2019/8672",
		"name": "ADEYEMI DAVID ADEOLA",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2019/8097",
		"name": "OKPO AKIOTU DAVID",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2019/8105",
		"name": "ADEOYE LUKMAN  TIWALADE",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2019/8161",
		"name": "OLUWAGBENRO-THOMAS DANIEL AYOOLA",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2019/8202",
		"name": "NOBLE PRECIOUS CHIMENEM",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2019/8207",
		"name": "ODIACHI CHUKWUELOKA MARIO",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2019/8223",
		"name": "ERIBA GEORGE NDOWOBE",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2019/8260",
		"name": "ESANGBEDO ERONWONSELE BLESSING",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2019/8343",
		"name": "ONI ABDULWAHAB  ALABI",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2019/8390",
		"name": "ASASA MARO GREAT",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2019/8432",
		"name": "UWAGBOE EMMANUEL NELLY",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2019/8436",
		"name": "OKARO KENECHUKWU",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2019/8517",
		"name": "NYONG-BASSEY NYONG JUNIOR KOKO",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2019/8576",
		"name": "EZEBUIRO EMMANUEL",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2019/8653",
		"name": "ADEJUMO OLUWAPELUMI PRAISE",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2018/6984",
		"name": "MACMILLAN RAYMOND",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2018/7002",
		"name": "ADEKUNLE ROSEMARY FUNKE",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2018/7003",
		"name": "DENNIS GOD'SWILL EMMANUEL",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2018/7108",
		"name": "TORIOLA  GBOUNMI PHILIP",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2018/7217",
		"name": "KOMOLAFE DIVINE OLUWALAFE",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2019/8477",
		"name": "EYEKOMAGBA  OGHENETEGA",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2017/6226",
		"name": "ORONSAYE ALEXANDER OSAHON",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2017/6232",
		"name": "LAWAL TIMILEYIN OLUWASEGUN",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2018/6985",
		"name": "IYARE OLUWAGBEMIGA EDERIBHALO",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2018/6986",
		"name": "AFOLABI DAVID FISAYO",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2018/6990",
		"name": "OVIENLOBA  JOEL OSAMUDIAMHEN",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2018/6991",
		"name": "MUSTAPHA SAHEED KOLAWOLE",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2018/6993",
		"name": "MAKINDE TOLULOPE DEMILADE",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2018/6995",
		"name": "RAJI OMOBOLAJI FATIU",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2018/6996",
		"name": "ABDULRAZAQ SHERIFF AHMED",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2018/7019",
		"name": "AKINBO OKIKIOLUWANTAN AKINBIYI",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2018/7020",
		"name": "UBOM IDARA JOY",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2018/7021",
		"name": "ELISHA - OPUSUNJU  TELEMA",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2018/7022",
		"name": "EZEKIEL OLUWASEGUN RAPHEAL",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2018/7023",
		"name": "EKWENEM  CHIDERA INNOCENT ",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2018/7024",
		"name": "ESSIEN  ESSIEN EFFIOM",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2018/7059",
		"name": "HAMZA HABIBULLAH",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2018/7081",
		"name": "COLE AYOMIPOSI VICTORIA",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2018/7115",
		"name": "ABERUAGBA ADERINSOLA ABIODUN",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2018/7139",
		"name": "OLUBOWALE OLUWATENIOLA DANIEL",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2018/7142",
		"name": "AHMED SHERIFAT ABDULRAZAQ",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2018/7157",
		"name": "EKONG-PAUL LOIS ADA",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2018/7192",
		"name": "IGBEN NOAH IRORO",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2018/7201",
		"name": "EJIKEME  CHELSEA ADA",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2018/7204",
		"name": "ADEPITAN FOGOFUNOLUWA WILLIAM",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2018/7216",
		"name": "UMOH NSIKAK BASSEY",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2018/7234",
		"name": "IYAPO OPEYEMI MICHAEL",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2018/7246",
		"name": "BELLO AWWAL ADEBOLA",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2018/7264",
		"name": "OYADIRAN OLUWATOBI TAIWO",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2018/7266",
		"name": "NWANKWO OLISA EMEKA DONALD",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2018/7276",
		"name": "JINTORO YUSUF NABIL",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2018/7277",
		"name": "ENE MAC-ANTHONY RAY",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2018/7301",
		"name": "OKEKE JECIL CHIBUEZE",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2018/7314",
		"name": "FATOKUN PELUMI JOSEPH",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2019/8068",
		"name": "NWANOROH FAVOUR CHIDERA",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2019/8070",
		"name": "OGUNMOROTI  JOSHUA ADEDAYO",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2019/8330",
		"name": "ONWUBIKO EBERECHUKWU",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2019/8434",
		"name": "DAKWAK JAKE TONGNAN",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2019/8484",
		"name": "MUSA  ABDULKOWIYI ABDULRAHMAN",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2019/8490",
		"name": "ELIAS SADEEQ AYOTOMIWA",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2019/8504",
		"name": "HUMPHREY-NWOKOLO IKENNA",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2019/8545",
		"name": "ETAKPOFE  EMMANUEL ONOME ",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2019/8547",
		"name": "OLAJIDE OLAMILEKAN EMMANUEL",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2019/8564",
		"name": "ONYARIN KELECHI EMMANUEL",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2019/8580",
		"name": "OSITA REN JUNIOR",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2019/8609",
		"name": "ARE IFELOLUWA OLANIYI",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2019/8646",
		"name": "OYENIYI DAVID AYOOLUWA ",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2019/8649",
		"name": "AJANI LISA ADEOLA",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2016/4609",
		"name": "ADEBANJO TOLUWANIMI DANIEL",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2017/5632",
		"name": "AJAGBE OLUWADAMILOLA SAMUEL",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2017/5701",
		"name": "HUMPHERY NWOKOLO,  NKEMKA DEBORAH",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2017/5715",
		"name": "IPHEGHE Kesiena Emmanuel",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2017/5722",
		"name": "OZUGHA ROQEEB OBIAJULU",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2017/5737",
		"name": "ODUSAMI OLATUNDE SOLOMON",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2017/5746",
		"name": "EDAFE PRECIOUS EMUDIAGA",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2017/5766",
		"name": "UKO AKANOWO INIOBONG",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2017/5786",
		"name": "ADEYEMI TAIWO OLAMIDE",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2017/5869",
		"name": "ONABOTE ISRAEL OLANREWAJU",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2017/5918",
		"name": "OBAKEMI SAMUEL ADEMOLA",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2017/5925",
		"name": "AKINWANDE EMMANUEL OLUWATOBI",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2017/5941",
		"name": "OBADARE VICTOR OLUMIDE",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2017/5961",
		"name": "ABDULKAREEM ABUBAKAR SADIQ",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2017/5962",
		"name": "OKPUBIGHO ABEL RUKEVWE",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2017/5970",
		"name": "AFONJA ADEDOYINMOLA ADEYEMI",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2017/5971",
		"name": "UBONG CONFIDENCE NATHANIEL",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2017/5982",
		"name": "MARCUS GODWIN NNAMDI",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2017/6005",
		"name": "IDAHOSA EWERE EDITH",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2017/6007",
		"name": "OLADELE OLUWASEYI EMMANUEL",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2017/6036",
		"name": "SADIQ Salman Fari",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2017/6038",
		"name": "JIBUEZE ANTHONY IKECHUKWU",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2017/6057",
		"name": "MAGAJI ADAM IBRAHIM",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2017/6110",
		"name": "AMEH-OMALE DAVID OWOICHOLOHI",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2017/6119",
		"name": "AZEEZ IBRAHIM OLALEKAN",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2017/6120",
		"name": "TOKI OLANREWAJU ENOCH",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2017/6132",
		"name": "BAKRE FAYSAL OLADIPUPO",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2017/6149",
		"name": "ANAYO CHINONSO TIMOTHY",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2017/6182",
		"name": "AKANNI OMOTOLANI OYEPEJU",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2018/6989",
		"name": "KALU CHIJIOKE SAMUEL",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2018/7263",
		"name": "FESTUS-OLALEYE AYOMIKUN OLUWASEMILORE",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2018/7333",
		"name": "OGBOGHRO KEVIN OBARO",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2017/5727",
		"name": "OLOBATOKE Benjamin Damilare",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2017/5764",
		"name": "ONUOHA JUANITA CHIAMAKA",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2018/7194",
		"name": "AYORINDE MICHAEL OLAMIPOSI",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2018/7244",
		"name": "OLOWOGORIOYE AYOMIDE SAMUEL",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2015/4141",
		"name": "AKINWANDE OLUWADAMILARE REMILEKUN",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2016/4450",
		"name": "UMAR Abubakar Mayowa",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2016/4572",
		"name": "ANIUCHI Onyedikachi Michael",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2017/5705",
		"name": "ONWUDEBE DANIEL UGOCHUKWU ",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2017/5765",
		"name": "OLUWAGBEMIGA BOLUWATIFE KOLAWOLE",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2015/4356",
		"name": "SEGHOSIME ABDULMALIK ABDULRAQAK",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2016/4387",
		"name": "OSENI Malik Adeoye",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2016/4493",
		"name": "ADEBAYO AYOMIDE SIMON",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2016/4494",
		"name": "OYEWOLE TENIOLA AYODAPO",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2016/4549",
		"name": "MSHELIA Jeremiah James",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2016/4622",
		"name": "EZENWA KOSISOCHUKWU IFEANYI",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2016/4648",
		"name": "AIKHUEGBE VICTOR",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2016/4679",
		"name": "ALIMI ADEYEMI ABDULSAMAD",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2017/5890",
		"name": "AWOLOWO OLASUNKANMI CHARLES",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	},
	{
		"matNo": "2017/6028",
		"name": "AJAYI OLADIPUPO JOSEPH",
		"password": "",
		"gender": "",
		"department": "",
		"phone": "",
		"isFirstLogin": true,
		"hasVoted": false
	}
];

const adminController = () => {
  const getIndex = async (req, res) => {
    const allCandidates = await CandidatePosition.find();
    const allVotes = await VoteCount.find();
    const positions = await Position.find();
    const electionDetails = [];

    if(allCandidates.length === 0 || !allCandidates) {
      return res.render('admin/index', { electionDetails: [], positions: [] });
    } else {
      for (let oneCandidate of allCandidates) {
        const candidate = await Candidate.findOne({ _id:  oneCandidate.candidateId});
        const position = await Position.findOne({ _id:  oneCandidate.positionId});
        const candidateDetail = await User.findOne({ matNo: candidate.matNo });
        const votes = allVotes.find((x) => x.candidateId === oneCandidate.candidateId);
        electionDetails.push({
          name: candidateDetail.name,
          matNo: candidate.matNo,
          post: position.name,
          votes: votes.voteCount
        });
      }
      return res.render('admin/index', { electionDetails: electionDetails.reverse(), positions });
    }
  };

  const getChangePwd = async (req, res) => {
    try {
      const admin = await Admin.findOne({ _id: req.session.passport.user });
      if(admin) {
        return res.status(200).json({
          status: 'success',
          admin
        });
      }
    } catch (error) {
      return res.status(404).json({
        status: 'failed',
        message: 'No admin found'
      });
    }
  };

  const postChangePwd = async (req, res) => {
    const { user } = req.body;
    const { password } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const adminUpdate = await Admin.findByIdAndUpdate(user, { password: hashedPassword });
      if(adminUpdate) {
        return res.status(200).json({
          status: 'success',
          message: 'Admin updated successfully'
        });
      }
    } catch (error) {
      return res.json({
        status: 'failed',
        message: error.message,
        error
      });
    }
  };

  const createPosition = async (req, res) => {
    const positionName = req.body.position;
    const positionDesc = req.body.position_desc;
    const position = await Position.findOne({ name: positionName });
    if (position) {
      return res.status(400).json({
        status: 'failed',
        message: 'Position exists'
      });
    }

    const newPosition = {
      name: positionName,
      desc: positionDesc
    };

    try {
      const createdPosition = await Position.create(newPosition);
      return res.status(201).json({
        status: 'success',
        message: 'Position Created Successfully',
      });
    } catch (error) {
      return res.status(500).json({
        status: 'failed',
        message: 'Could not create position',
        error
      });
    }
  };

  const registerCandidate = async (req, res) => {
    const { matNo } = req.body;
    const { image } = req.body;
    const candidate = await Candidate.findOne({ matNo });
    if (candidate) {
      return res.status(400).json({
        status: 'failed',
        message: 'Candidate exists'
      });
    }

    const newCandidate = {
      matNo,
      image
    };

    try {
      const createdCandidate = await Candidate.create(newCandidate);
      return res.status(201).json({
        status: 'success',
        message: 'Candidate created successfully',
      });
    } catch (error) {
      return res.status(400).json({
        status: 'failed',
        message: 'Could not create candidate',
        error
      });
    }
  };

  const getMapCandidates = async (req, res) => {
    try {
      const candidates = await Candidate.find();
      const positions = await Position.find();
      if (!candidates || !positions) {
        return res.json({
          status: 'Failed',
          message: 'Create candidates first'
        });
      }
      const arr = [];
      for (let candidate of candidates) {
        const candidateDetail = await User.findOne({ matNo: candidate.matNo });
        arr.push({
          matNo: candidate.matNo,
          name: candidateDetail.name,
          id: candidate._id
        });
      }
      return res.render('admin/map-candidates', { arr, positions });
    } catch (error) {
      return res.json({
        status: 'Failed',
        message: 'Create candidates first',
        error
      });
    }
  };

  const postMapCandidate = async (req, res) => {
    const { candidateId } = req.body;
    const { positionId } = req.body;
    try {
      const candidateposition = await CandidatePosition.findOne({ candidateId });
      const voteCount = await VoteCount.findOne({ candidateId });
      if (candidateposition || voteCount) {
        return res.status(400).json({
          status: 'failed',
          message: 'Candidate has been mapped already'
        });
      }
    } catch (error) {
      if (candidateposition) {
        return res.status(400).json({
          status: 'failed',
          error
        });
      }
    }

    const newcandidatePosition = {
      candidateId,
      positionId
    };

    const voteCount = {
      candidateId,
      positionId
    };

    try {
      const createdCandidatePosition = await CandidatePosition.create(newcandidatePosition);
      const createdVoteCount = await VoteCount.create(voteCount);
      return res.status(201).json({
        status: 'success',
        message: 'Candidate mapped to position successfully',
      });
    } catch (error) {
      return res.status(500).json({
        status: 'failed',
        message: 'Could not map candidate to position',
        error
      });
    }
  };

  const fetchCandidates = async (req, res) => {

    const electionDetails = [];
    try {
      const allCandidates = await CandidatePosition.find();
      const positions = await Position.find();
      for (let oneCandidate of allCandidates) {
        const candidate = await Candidate.findOne({ _id: oneCandidate.candidateId });
        const position = await Position.findOne({ _id: oneCandidate.positionId });
        const candidateDetail = await User.findOne({ matNo: candidate.matNo });
        const candidateVote = await VoteCount.findOne({ positionId: oneCandidate.positionId });
        const imageSplit = candidate.image.split('/');
        electionDetails.push({
          name: candidateDetail.name,
          id: candidate._id,
          matNo: candidate.matNo,
          image: `${'/' + imageSplit[2] + '/' + imageSplit[3] + '/' + imageSplit[4] }`,
          post: position.name,
          votes: candidateVote.voteCount
        });
      }

      const posts = {
      };

      const allVotes = await VoteCount.find();

      for(let position of positions) {
        const postContesters = electionDetails.filter((x) => x.post === position.name);
        const positionVoters = await VoteCount.find({ positionId: position._id });
        let totalPositionVotes; 
        for(let i = 0; i < positionVoters.length; i++) {
          totalPositionVotes += positionVoters[i].voteCount;
        }
        posts[position.name] = {};
        posts[position.name].candidates = postContesters;
        posts[position.name].totalVotes = totalPositionVotes;
      }
      return res.status(200).json({
        status: 'success',
        positions,
        posts
      });
    } catch(error) {
      const newError = createError(500, error);
      return res.status(500).json({
        status: 'failed',
        error: newError
      });
    }
  };

  const uploadImage = (req, res) => {
    const formData = new formidable.IncomingForm();
    formData.maxFileSize = 2 * 1024 * 1024;
    formData.parse(req, (err, fields, files) => {
      if (files.image === undefined || files.image === 'null') {
        return res.status(400).json({
          status: 'failed',
          message: 'No post image recieved'
        });
      }

      if (err) {
        return res.status(400).json({
          status: 'failed',
          message: 'An error occured',
          error: error.message
        });
      }
      const oldPath = files.image.path;
      const newPath = `public/images/candidates/${files.image.name}`;
      return fs.rename(oldPath, newPath, (error) => {
        if (error) {
          debug('Error: ', error);
          return res.json({
            status: 'failed',
            message: 'Could not upload image',
            error
          });
        }
        return res.send(`/${newPath}`);
      });
    });
  };

  const getGenPasswordPage = async (req, res) => {
    try {
      const users = await User.find();
      if(!users || users.length === 0) {
        return res.render('admin/generate-pwd', { noUsers: true, users: [] });
      }
      return res.render('admin/generate-pwd', { users , noUsers: false });
    } catch (error) {
      debug(error);
      return res.render('admin/generate-pwd');
    }
  };

  const generatePasswords = async (req, res) => {
    for(let i = 0; i < users.length; i ++) {
      users[i].password = nanoid(10);
      try {
        const newUser = await User.create(users[i]);
        if(newUser) {
          debug('New User Created');
        }

        if(i === users.length -1) {
          return res.status(201).json({
            status: 'success',
            message: 'Passwords generated for all users'
          });
        }
      } catch (error) {
        return res.status(400).json({
          status: 'failed',
          message: 'Passwords not generated',
          error: error.message
        });
      }
    }
  };

  const middleware = (req, res, next) => {
    try {
      if (req.session.passport.user) {
        return next();
      }
    } catch (error) {
      return res.render('admin/401');
    }
  };

  return {
    getIndex,
    getChangePwd,
    postChangePwd,
    createPosition,
    registerCandidate,
    getMapCandidates,
    postMapCandidate,
    fetchCandidates,
    uploadImage,
    getGenPasswordPage,
    generatePasswords,
    middleware
  };
};

module.exports = adminController();