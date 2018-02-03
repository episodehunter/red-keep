DROP TABLE IF EXISTS `tv_featured`;

CREATE TABLE `tv_featured` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `show_id` int(11) unsigned NOT NULL,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `show_id` (`show_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
