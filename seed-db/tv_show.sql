DROP TABLE IF EXISTS `tv_show`;

CREATE TABLE `tv_show` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `tvdb_id` int(7) NOT NULL,
  `imdb_id` varchar(10) NOT NULL DEFAULT '',
  `name` varchar(255) CHARACTER SET utf8 NOT NULL DEFAULT '',
  `airs_dayOfWeek` varchar(9) NOT NULL DEFAULT '',
  `airs_time` varchar(8) NOT NULL DEFAULT '',
  `first_aired` varchar(10) NOT NULL DEFAULT '',
  `genre` varchar(255) NOT NULL DEFAULT '',
  `language` varchar(2) NOT NULL DEFAULT '',
  `network` varchar(20) NOT NULL DEFAULT '',
  `overview` text CHARACTER SET utf8 NOT NULL,
  `runtime` int(3) NOT NULL DEFAULT '0',
  `status` varchar(10) NOT NULL DEFAULT 'TBA',
  `fanart` varchar(50) DEFAULT NULL,
  `poster` varchar(50) DEFAULT NULL,
  `lastupdate` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

INSERT INTO `tv_show` (`id`, `tvdb_id`, `imdb_id`, `name`, `airs_dayOfWeek`, `airs_time`, `first_aired`, `genre`, `language`, `network`, `overview`, `runtime`, `status`, `fanart`, `poster`, `lastupdate`)
VALUES
	(4994, 305288, 'tt4574334', 'Stranger Things', 'Friday', '3 AM', '2016-07-15', '|Drama|Mystery|Science-Fiction|Thriller|', 'en', 'Netflix', 'When a young boy disappears, his mother, a police chief, and his friends must confront terrifying forces in order to get him back.', 50, 'Continuing', '5778c6062b0c0.jpg', '5778c606560dd.jpg', 1509477952),
	(144, 260449, 'tt2306299', 'Vikings', 'Wednesday', '9:00 PM', '2013-03-03', '|Action|Drama|', 'en', 'History', 'Vikings follows the adventures of Ragnar Lothbrok the greatest hero of his age. The series tells the sagas of Ragnar\'s band of Viking brothers and his family, as he rises to become King of the Viking tribes. As well as being a fearless warrior, Ragnar embodies the Norse traditions of devotion to the gods, legend has it that he was a direct descendant of Odin, the god of war and warriors.', 45, 'Continuing', '512ae1e0c63e0.jpg', '512ae1dfd1ecc.jpg', 1508210752),
	(10, 121361, 'tt0944947', 'Game of Thrones', 'Sunday', '9:00 PM', '2011-04-17', '|Adventure|Drama|Fantasy|', 'en', 'HBO', 'Seven noble families fight for control of the mythical land of Westeros. Friction between the houses leads to full-scale war. All while a very ancient evil awakens in the farthest north. Amidst the war, a neglected military order of misfits, the Night\'s Watch, is all that stands between the realms of men and the icy horrors beyond.', 55, 'Continuing', '504241d8bbe1d-1.jpg', '504241d7e6a13-2.jpg', 1509730347);
