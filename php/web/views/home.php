<html>
<head>
<titl>home.ph文件</titl>
</head>
<body>
    <h1>这个是home.php 文件!</h1>
    <?php echo $title ?>
    <hr/>
    <?php foreach($name as $v)?>
    <span> <?php echo $v ?> </span>
    <?php endforeach?>
</body>
</html>
