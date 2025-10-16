'use client';
import { decrypt, encrypt } from '@/utils/encrypt-decrypt';
import { useParams } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import React, { useEffect } from 'react'
const Customer = () => {
  const {customer} = useParams();
  console.log(customer?.toString()?.replaceAll('%',':'))
  console.log(encrypt('12,12:92212:00,1,2'))
  console.log('ddedcry',customer&&decrypt('bd1eed3119e4cb17235fff7ec9c5ed36:3A97cc4122ee686f7ed116f65d95cd1bbf:3A45827e4a8fb648ea26df3ae5a506f373153ae3a4ebc2ac307dc5fdb576e6287df644088506'))
  
  return (
    <>
    <QRCodeSVG value={'12,12:92212:00,1,2'} />
    <div>Customer</div>
    </>
  )
}

export default Customer