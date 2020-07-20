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
@Table(name = "t_clientinfo")
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerInfo implements Serializable {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id")
  private Long id;

  // 访客ID
  @Column(name = "clientid")
  private String clientid;

  // 连接状态
  @Column(name = "connected")
  private Short connected;


  @Column(name = "mostsignbits")
  private Long mostsignbits;

  @Column(name = "leastsignbits")
  private Long leastsignbits;
  
  // 最后一次连接时间
  @Column(name = "lastconnecteddate")
  private Date lastconnecteddate;
}