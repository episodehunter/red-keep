DROP TABLE IF EXISTS `tv_follow`;
CREATE TABLE `tv_follow` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) unsigned DEFAULT NULL,
  `show_id` int(11) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `user_id` (`user_id`,`show_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
