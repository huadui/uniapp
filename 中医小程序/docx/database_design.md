# 中医智能问答小程序 - 数据库设计文档

## 一、数据库概述

本文档为中医智能问答小程序的数据库设计方案，基于 MySQL 8.0+ 设计，支持微信小程序的用户管理、问诊记录、体质测评、舌诊面诊等核心功能。

---

## 二、数据库表结构

### 1. 用户表 (users)

存储用户基本信息，支持微信登录。

```sql
  CREATE TABLE `users` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '用户ID',
    `openid` VARCHAR(64) NOT NULL COMMENT '微信OpenID',
    `unionid` VARCHAR(64) DEFAULT NULL COMMENT '微信UnionID（多平台互通）',
    `nickname` VARCHAR(64) DEFAULT '微信用户' COMMENT '昵称',
    `avatar_url` VARCHAR(512) DEFAULT NULL COMMENT '头像URL',
    `gender` TINYINT DEFAULT 0 COMMENT '性别：0未知 1男 2女',
    `phone` VARCHAR(20) DEFAULT NULL COMMENT '手机号',
    `birthday` DATE DEFAULT NULL COMMENT '出生日期',
    `status` TINYINT DEFAULT 1 COMMENT '状态：0禁用 1正常',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_openid` (`openid`),
    KEY `idx_unionid` (`unionid`),
    KEY `idx_phone` (`phone`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';
```

---

### 2. 用户会话表 (user_sessions)

管理用户登录会话和Token。

```sql
CREATE TABLE `user_sessions` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '会话ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  `session_key` VARCHAR(128) NOT NULL COMMENT '微信session_key',
  `token` VARCHAR(256) NOT NULL COMMENT '自定义登录态Token',
  `expire_at` DATETIME NOT NULL COMMENT '过期时间',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_token` (`token`),
  KEY `idx_expire` (`expire_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户会话表';
```

---

### 3. 问诊会话表 (consultation_sessions)

存储用户与AI的问诊会话。

```sql
CREATE TABLE `consultation_sessions` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '会话ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  `title` VARCHAR(128) DEFAULT '问诊记录' COMMENT '会话标题',
  `summary` VARCHAR(512) DEFAULT NULL COMMENT '会话摘要（主诉）',
  `diagnosis_tags` JSON DEFAULT NULL COMMENT '诊断标签，如["气郁质","肝火旺"]',
  `status` TINYINT DEFAULT 1 COMMENT '状态：0已删除 1进行中 2已结束',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_status` (`status`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='问诊会话表';
```

---

### 4. 问诊消息表 (consultation_messages)

存储问诊会话中的每条消息。

```sql
CREATE TABLE `consultation_messages` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '消息ID',
  `session_id` BIGINT UNSIGNED NOT NULL COMMENT '会话ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  `role` ENUM('user', 'ai') NOT NULL COMMENT '角色：user用户 ai助手',
  `content` TEXT NOT NULL COMMENT '消息内容',
  `card_data` JSON DEFAULT NULL COMMENT '结构化卡片数据（AI回复的诊断建议等）',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_session_id` (`session_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='问诊消息表';
```

**card_data 示例：**
```json
{
  "tags": ["心虚胆怯", "安神"],
  "sections": [
    {"icon": "ri-bowl-line", "title": "食疗方略", "content": "宜食百合、莲子、酸枣仁。"},
    {"icon": "ri-hand-heart-line", "title": "调养建议", "content": "睡前泡足，按揉内关穴。"}
  ]
}
```

---

### 5. 舌诊记录表 (tongue_diagnoses)

存储舌象识别分析记录。

```sql
CREATE TABLE `tongue_diagnoses` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '记录ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  `image_url` VARCHAR(512) NOT NULL COMMENT '舌象图片URL',
  `tongue_quality` VARCHAR(64) DEFAULT NULL COMMENT '舌质，如"淡白胖嫩"',
  `tongue_coating` VARCHAR(64) DEFAULT NULL COMMENT '舌苔，如"白腻"',
  `diagnosis` VARCHAR(128) DEFAULT NULL COMMENT '综合诊断，如"脾虚湿盛"',
  `diagnosis_desc` TEXT DEFAULT NULL COMMENT '诊断描述',
  `suggestions` JSON DEFAULT NULL COMMENT '调理建议',
  `ai_raw_response` JSON DEFAULT NULL COMMENT 'AI原始返回数据',
  `status` TINYINT DEFAULT 1 COMMENT '状态：0已删除 1正常',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='舌诊记录表';
```

**suggestions 示例：**
```json
[
  "饮食宜清淡，多食山药、白扁豆、薏米。",
  "少食生冷瓜果及油腻之品。",
  "可适当运动，以助阳气升发，运化水湿。"
]
```

---

### 6. 面诊记录表 (face_diagnoses)

存储面相识别分析记录。

```sql
CREATE TABLE `face_diagnoses` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '记录ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  `image_url` VARCHAR(512) NOT NULL COMMENT '面相图片URL',
  `face_color` VARCHAR(32) DEFAULT NULL COMMENT '面色，如"萎黄"',
  `face_luster` VARCHAR(32) DEFAULT NULL COMMENT '光泽，如"少华"',
  `face_spirit` VARCHAR(32) DEFAULT NULL COMMENT '神态，如"疲惫"',
  `diagnosis` VARCHAR(128) DEFAULT NULL COMMENT '综合诊断，如"脾胃气虚"',
  `diagnosis_desc` TEXT DEFAULT NULL COMMENT '诊断描述',
  `organ_status` JSON DEFAULT NULL COMMENT '脏腑状况',
  `suggestions` JSON DEFAULT NULL COMMENT '养生建议',
  `ai_raw_response` JSON DEFAULT NULL COMMENT 'AI原始返回数据',
  `status` TINYINT DEFAULT 1 COMMENT '状态：0已删除 1正常',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='面诊记录表';
```

**organ_status 示例：**
```json
{
  "heart": "ok",
  "liver": "ok", 
  "spleen": "warn",
  "lung": "ok",
  "kidney": "ok"
}
```

---

### 7. 体质测评问题表 (constitution_questions)

存储体质测评的问题（九种体质问卷）。

```sql
CREATE TABLE `constitution_questions` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '问题ID',
  `question_no` INT NOT NULL COMMENT '问题序号',
  `constitution_type` VARCHAR(32) NOT NULL COMMENT '体质类型：气虚质/阳虚质/阴虚质/痰湿质/湿热质/血瘀质/气郁质/特禀质/平和质',
  `tag` VARCHAR(32) DEFAULT NULL COMMENT '问题标签，如"气虚相关"',
  `content` VARCHAR(512) NOT NULL COMMENT '问题内容',
  `sort_order` INT DEFAULT 0 COMMENT '排序',
  `status` TINYINT DEFAULT 1 COMMENT '状态：0禁用 1启用',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_constitution_type` (`constitution_type`),
  KEY `idx_sort_order` (`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='体质测评问题表';
```

---

### 8. 体质测评记录表 (constitution_tests)

存储用户的体质测评记录。

```sql
CREATE TABLE `constitution_tests` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '测评ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  `answers` JSON NOT NULL COMMENT '答案，格式：{"1":3,"2":4,...}',
  `scores` JSON DEFAULT NULL COMMENT '各体质得分',
  `primary_constitution` VARCHAR(32) DEFAULT NULL COMMENT '主体质类型',
  `secondary_constitution` VARCHAR(32) DEFAULT NULL COMMENT '兼夹体质类型',
  `result_summary` TEXT DEFAULT NULL COMMENT '结果摘要',
  `suggestions` JSON DEFAULT NULL COMMENT '调理建议',
  `status` TINYINT DEFAULT 1 COMMENT '状态：0已删除 1正常',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='体质测评记录表';
```

**scores 示例：**
```json
{
  "qi_deficiency": 75,
  "yang_deficiency": 45,
  "yin_deficiency": 30,
  "phlegm_dampness": 60,
  "damp_heat": 55,
  "blood_stasis": 25,
  "qi_stagnation": 40,
  "special": 20,
  "balanced": 50
}
```

---

### 9. 文章表 (articles)

存储健康科普文章（医道传承）。

```sql
CREATE TABLE `articles` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '文章ID',
  `title` VARCHAR(256) NOT NULL COMMENT '文章标题',
  `summary` VARCHAR(512) DEFAULT NULL COMMENT '文章摘要',
  `content` LONGTEXT NOT NULL COMMENT '文章内容（富文本）',
  `cover_url` VARCHAR(512) DEFAULT NULL COMMENT '封面图URL',
  `tags` JSON DEFAULT NULL COMMENT '标签，如["食疗","节气"]',
  `category` VARCHAR(32) DEFAULT NULL COMMENT '分类：食疗/经典/养生/节气',
  `view_count` INT UNSIGNED DEFAULT 0 COMMENT '阅读量',
  `like_count` INT UNSIGNED DEFAULT 0 COMMENT '点赞数',
  `sort_order` INT DEFAULT 0 COMMENT '排序权重',
  `status` TINYINT DEFAULT 1 COMMENT '状态：0下架 1上架',
  `publish_at` DATETIME DEFAULT NULL COMMENT '发布时间',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_category` (`category`),
  KEY `idx_status` (`status`),
  KEY `idx_publish_at` (`publish_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='文章表';
```

---

### 10. 用户收藏表 (user_favorites)

存储用户收藏的文章。

```sql
CREATE TABLE `user_favorites` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '收藏ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  `article_id` BIGINT UNSIGNED NOT NULL COMMENT '文章ID',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '收藏时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_article` (`user_id`, `article_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_article_id` (`article_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户收藏表';
```

---

### 11. 节气信息表 (solar_terms)

存储二十四节气信息。

```sql
CREATE TABLE `solar_terms` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '节气ID',
  `name` VARCHAR(16) NOT NULL COMMENT '节气名称，如"小雪"',
  `date_pattern` VARCHAR(16) NOT NULL COMMENT '日期模式，如"11-22"',
  `year` INT DEFAULT NULL COMMENT '具体年份（可选，用于精确日期）',
  `exact_date` DATE DEFAULT NULL COMMENT '精确日期',
  `description` VARCHAR(128) DEFAULT NULL COMMENT '节气描述，如"气寒将雪，地气闭藏"',
  `health_tips` TEXT DEFAULT NULL COMMENT '养生提示',
  `food_suggestions` VARCHAR(256) DEFAULT NULL COMMENT '饮食建议',
  `sort_order` INT DEFAULT 0 COMMENT '排序（1-24）',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_date_pattern` (`date_pattern`),
  KEY `idx_exact_date` (`exact_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='节气信息表';
```

---

### 12. 系统配置表 (system_configs)

存储系统配置项。

```sql
CREATE TABLE `system_configs` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '配置ID',
  `config_key` VARCHAR(64) NOT NULL COMMENT '配置键',
  `config_value` TEXT NOT NULL COMMENT '配置值',
  `description` VARCHAR(256) DEFAULT NULL COMMENT '配置说明',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_config_key` (`config_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='系统配置表';
```

---

## 三、ER 关系图

```
┌─────────────────┐
│     users       │
├─────────────────┤
│ id (PK)         │
│ openid          │
│ nickname        │
│ ...             │
└────────┬────────┘
         │
         │ 1:N
         ▼
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  ┌──────────────────┐  ┌──────────────────┐  ┌───────────────┐ │
│  │consultation_     │  │ tongue_diagnoses │  │face_diagnoses │ │
│  │sessions          │  ├──────────────────┤  ├───────────────┤ │
│  ├──────────────────┤  │ id (PK)          │  │ id (PK)       │ │
│  │ id (PK)          │  │ user_id (FK)     │  │ user_id (FK)  │ │
│  │ user_id (FK)     │  │ image_url        │  │ image_url     │ │
│  │ title            │  │ diagnosis        │  │ diagnosis     │ │
│  │ ...              │  │ ...              │  │ ...           │ │
│  └────────┬─────────┘  └──────────────────┘  └───────────────┘ │
│           │                                                     │
│           │ 1:N                                                 │
│           ▼                                                     │
│  ┌──────────────────┐  ┌──────────────────┐  ┌───────────────┐ │
│  │consultation_     │  │constitution_tests│  │user_favorites │ │
│  │messages          │  ├──────────────────┤  ├───────────────┤ │
│  ├──────────────────┤  │ id (PK)          │  │ id (PK)       │ │
│  │ id (PK)          │  │ user_id (FK)     │  │ user_id (FK)  │ │
│  │ session_id (FK)  │  │ answers          │  │ article_id(FK)│ │
│  │ content          │  │ scores           │  │ ...           │ │
│  │ ...              │  │ ...              │  └───────┬───────┘ │
│  └──────────────────┘  └──────────────────┘          │         │
│                                                       │         │
└───────────────────────────────────────────────────────┼─────────┘
                                                        │
                                                        │ N:1
                                                        ▼
                                               ┌───────────────┐
                                               │   articles    │
                                               ├───────────────┤
                                               │ id (PK)       │
                                               │ title         │
                                               │ content       │
                                               │ ...           │
                                               └───────────────┘

独立表：
┌─────────────────────┐  ┌───────────────┐  ┌───────────────┐
│constitution_questions│  │  solar_terms  │  │system_configs │
├─────────────────────┤  ├───────────────┤  ├───────────────┤
│ id (PK)             │  │ id (PK)       │  │ id (PK)       │
│ constitution_type   │  │ name          │  │ config_key    │
│ content             │  │ description   │  │ config_value  │
│ ...                 │  │ ...           │  │ ...           │
└─────────────────────┘  └───────────────┘  └───────────────┘
```

---

## 四、索引设计说明

| 表名 | 索引名 | 索引字段 | 用途 |
|------|--------|----------|------|
| users | uk_openid | openid | 微信登录唯一标识 |
| consultation_sessions | idx_user_id | user_id | 查询用户的问诊记录 |
| consultation_messages | idx_session_id | session_id | 查询会话消息列表 |
| tongue_diagnoses | idx_user_id | user_id | 查询用户舌诊记录 |
| face_diagnoses | idx_user_id | user_id | 查询用户面诊记录 |
| constitution_tests | idx_user_id | user_id | 查询用户体质报告 |
| user_favorites | uk_user_article | user_id, article_id | 防止重复收藏 |
| articles | idx_status | status | 筛选上架文章 |

---

## 五、数据字典

### 体质类型对照表

| 英文标识 | 中文名称 | 说明 |
|----------|----------|------|
| qi_deficiency | 气虚质 | 元气不足 |
| yang_deficiency | 阳虚质 | 阳气不足，畏寒怕冷 |
| yin_deficiency | 阴虚质 | 阴液亏少，口燥咽干 |
| phlegm_dampness | 痰湿质 | 痰湿凝聚，形体肥胖 |
| damp_heat | 湿热质 | 湿热内蕴，面垢油光 |
| blood_stasis | 血瘀质 | 血行不畅，肤色晦暗 |
| qi_stagnation | 气郁质 | 气机郁滞，情志抑郁 |
| special | 特禀质 | 先天失常，过敏体质 |
| balanced | 平和质 | 阴阳气血调和 |

### 脏腑状态对照表

| 状态值 | 说明 |
|--------|------|
| ok | 正常 |
| warn | 需关注 |
| alert | 异常 |

---

## 六、初始化数据

### 体质测评问题初始数据

```sql
INSERT INTO `constitution_questions` (`question_no`, `constitution_type`, `tag`, `content`, `sort_order`) VALUES
(1, 'qi_deficiency', '气虚相关', '您是否容易感到疲乏，精神不振，且稍微活动后就容易出汗？', 1),
(2, 'yang_deficiency', '阳虚相关', '您手脚发凉吗？', 2),
(3, 'yin_deficiency', '阴虚相关', '您感到口干咽燥、总想喝水吗？', 3),
(4, 'phlegm_dampness', '痰湿相关', '您感到胸闷或腹部胀满吗？', 4),
(5, 'damp_heat', '湿热相关', '您面部或鼻部有油腻感或者油亮发光吗？', 5),
(6, 'blood_stasis', '血瘀相关', '您的皮肤在不知不觉中会出现青紫瘀斑（皮下出血）吗？', 6),
(7, 'qi_stagnation', '气郁相关', '您感到闷闷不乐、情绪低沉吗？', 7),
(8, 'special', '特禀相关', '您容易过敏（对药物、食物、气味、花粉或在季节交替、气候变化时）吗？', 8),
(9, 'balanced', '平和相关', '您精力充沛吗？', 9),
(10, 'qi_deficiency', '综合评估', '您容易忘事（健忘）吗？', 10);
```

### 节气初始数据示例

```sql
INSERT INTO `solar_terms` (`name`, `date_pattern`, `description`, `health_tips`, `food_suggestions`, `sort_order`) VALUES
('立春', '02-04', '春季开始，万物复苏', '宜养肝护阳，早睡早起', '宜食韭菜、香椿、春笋', 1),
('雨水', '02-19', '降雨开始，雨量渐增', '宜健脾祛湿，调畅情志', '宜食山药、红枣、蜂蜜', 2),
('小雪', '11-22', '气寒将雪，地气闭藏', '宜温补益肾，早卧晚起', '宜食黑芝麻、羊肉、核桃', 20),
('大雪', '12-07', '雪量增大，天气更冷', '宜补肾防寒，温阳散寒', '宜食牛肉、羊肉、桂圆', 21);
```

---

## 七、扩展建议

1. **分表策略**：当 `consultation_messages` 数据量超过千万级时，可按 `user_id` 或 `created_at` 进行分表。

2. **缓存设计**：
   - 用户信息缓存（Redis）
   - 节气信息缓存（每日更新）
   - 热门文章缓存

3. **数据归档**：超过1年的问诊记录可归档到历史表。

4. **安全考虑**：
   - 用户图片存储使用对象存储（OSS）
   - 敏感数据加密存储
   - API 接口限流

---

## 八、版本记录

| 版本 | 日期 | 说明 |
|------|------|------|
| v1.0 | 2024-12-17 | 初始版本，包含核心表结构 |
