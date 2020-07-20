package com.wjw.chat.message.entity;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "t_messageinfo")
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessageInfo implements Serializable {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id")
  private Long id;

  // 源客户端id
  private String sourceClientId;
  // 目标客户端id
  private String targetClientId;
  // 消息类型
  private String msgType;
  // 消息内容
  private String msgContent;
  // 信息已读 = 0 未读 = 1
  private String readFlg;
  // 发送时间
  private Date sendTime;
  // 读取时间
  private Date readTime;
  // 访客来源
  private String fromUrl;

}