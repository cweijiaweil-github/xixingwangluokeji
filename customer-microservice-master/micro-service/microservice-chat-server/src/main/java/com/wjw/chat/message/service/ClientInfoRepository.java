package com.wjw.chat.message.service;

import com.wjw.chat.message.entity.CustomerInfo;

import org.springframework.data.repository.CrudRepository;
  
  
public interface ClientInfoRepository extends CrudRepository<CustomerInfo, String>{ 
  CustomerInfo findClientByclientid(String CustomerInfo); 
} 