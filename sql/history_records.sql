-- 舌诊记录表
CREATE TABLE IF NOT EXISTS `tongue_diagnosis_records` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `user_id` bigint(20) NOT NULL COMMENT '用户ID',
  `image_url` varchar(500) DEFAULT NULL COMMENT '舌象图片URL',
  `diagnosis` varchar(255) DEFAULT NULL COMMENT '辨证结果',
  `advice` text COMMENT '调理建议',
  `full_result_json` text COMMENT '完整分析结果JSON',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='舌诊记录表';

-- 面诊记录表
CREATE TABLE IF NOT EXISTS `face_diagnosis_records` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `user_id` bigint(20) NOT NULL COMMENT '用户ID',
  `image_url` varchar(500) DEFAULT NULL COMMENT '面相图片URL',
  `diagnosis` varchar(255) DEFAULT NULL COMMENT '综合诊断',
  `advice` text COMMENT '养生建议',
  `full_result_json` text COMMENT '完整分析结果JSON',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='面诊记录表';

-- 体质辨识记录表
CREATE TABLE IF NOT EXISTS `constitution_records` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `user_id` bigint(20) NOT NULL COMMENT '用户ID',
  `main_constitution` varchar(100) DEFAULT NULL COMMENT '主体质',
  `tendency_constitution` varchar(255) DEFAULT NULL COMMENT '倾向体质',
  `scores_json` text COMMENT '各体质得分JSON',
  `advice` text COMMENT '调理建议',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='体质辨识记录表';

-- 智能问诊记录表
CREATE TABLE IF NOT EXISTS `inquiry_records` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `user_id` bigint(20) NOT NULL COMMENT '用户ID',
  `main_symptom` varchar(255) DEFAULT NULL COMMENT '主诉',
  `diagnosis` varchar(255) DEFAULT NULL COMMENT '初步诊断/辨证',
  `advice` text COMMENT '建议',
  `chat_log_json` longtext COMMENT '对话记录JSON',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='智能问诊记录表';
