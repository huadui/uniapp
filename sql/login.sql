CREATE TABLE `users` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键，内部用户ID',
  `openid` VARCHAR(64) NOT NULL COMMENT '微信OpenID（核心唯一标识）',
  `unionid` VARCHAR(64) DEFAULT NULL COMMENT '微信UnionID（跨端互通备用）',
  `nickname` VARCHAR(64) DEFAULT '微信用户' COMMENT '用户昵称',
  `avatar_url` VARCHAR(512) DEFAULT NULL COMMENT '用户头像URL',
  `gender` TINYINT DEFAULT 0 COMMENT '性别：0未知，1男，2女',
  `phone_number` VARCHAR(32) DEFAULT NULL COMMENT '用户手机号',
  `session_key` VARCHAR(64) DEFAULT NULL COMMENT '微信登录 session_key',
  `status` TINYINT DEFAULT 1 COMMENT '账号状态：0禁用，1正常',
  `last_login_time` DATETIME DEFAULT NULL COMMENT '最后登录时间',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '注册时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '信息最后修改时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_openid` (`openid`) -- 仅保留 OpenID 唯一索引即可
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户信息表';