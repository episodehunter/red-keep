DROP TABLE IF EXISTS `tv_watched`;

CREATE TABLE `tv_watched` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `serie_id` int(10) unsigned NOT NULL,
  `season` int(2) unsigned NOT NULL DEFAULT '0',
  `episode` int(3) unsigned NOT NULL DEFAULT '0',
  `time` int(10) unsigned DEFAULT '0',
  `type` int(1) unsigned DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `user_id` (`user_id`,`serie_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
