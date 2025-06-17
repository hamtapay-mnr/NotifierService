# NotifierService

## ویژگی ها
سرویس اطلاع رسانی وظیفه ارسال فاکتور به مشتری و ارسال هشدار به مدیریت را دارد.
این سرویس قابلیت های زیر را دارد:
- فاکتور خرید برای مشتری ارسال شود
- در صورت رسیدن موجودی به حد هشدار (۵٪) به مدیریت اطلاع رسانی شود


# نحوه راه اندازی
این سرویس به پکیج های زیر وابسته است
```
node v22
redis v5
```
برای نصب دستور زیر را اجرا کنید:
```
npm i
```

برای اجرا دستور زیر را اجرا کنید
```
node index.js
OR
npm start
```
سرویس هنگام استارت تلاش میکند که صف های مورد نیازش را بسازد.
```
Initial dependencies
Creating group:  price-factor order_group
Creating group:  user-factor order_group
Creating group:  admin-warning order_group
Start listening to queue: order_group price-factor notifier_service
```
هر پیام صف ورودی باید کلیدهای زیر را شامل باشد:
```
amount میزان خریداری شده
username نام کاربری خریدار
price قیمت خرید
remainingGoldPercentage درصد طلای باقی مانده در خزانه
```
به ازای هر سفارش جدیدی که دریافت شود سرویس لاگ زیر را ایجاد میکند.
```
Recieved new factor:  { amount: 1, username: 'milad', price: 0, remainingGoldPercentage: 3 }
New factor:  { username: 'milad', price: 0, amount: 1 }
Processed new message:  1750193824913-0 order_group price-factor
```
و در صورتی که از میزان مجاز مقدار طلا کمتر شود لاگ زیر چاپ میشود:
```
Recieved new factor:  { amount: 1, username: 'milad', price: 0, remainingGoldPercentage: 4 }
Send warning to admin:  { inventoryRemainingPercentage: 4 }
New factor:  { username: 'milad', price: 0, amount: 1 }
Processed new message:  1750193823224-0 order_group price-factor
```

## نحوه استفاده
این سرویس رابطی برای ارسال درخواست مستقیم ندارد و تمام درخواست ها را از طریق رخداد صف ورودی دریافت میکند. پس فقط کافیست تا آن را اجرا کنید.   
ترتیب اجرای سرویس نسبت به سایر سرویس های سامانه مهم نیست.   
این سرویس state-less است و در صورت نیاز میتوانید چند نسخه از این سرویس بالا بیاورید.