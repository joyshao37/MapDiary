//查看目前登入狀況
var user;
var Dname = document.getElementById('Dname');
var SignIn = document.getElementById('SignIn');
var profileName = document.getElementById('profile-name');
var note = document.getElementById('note');
var noteDetail = document.getElementById('noteDetail');
var noteContent = document.getElementById('noteContent');
var notekey = [];
var noteId = "";
var x = 0;
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    user = user;
     // console.log(SignIn);
    SignIn.innerHTML = "";
    if(user.photoURL != null){

      var toUser = document.createElement("a");
      var img = document.createElement("img");

      if(user.providerData[0].providerId == "facebook.com"){
        img.src = "https://graph.facebook.com/" + user.providerData[0].uid +"/picture?height=500";
      }else{
        img.src = user.photoURL;
      }
      toUser.append(img);
      img.className += " dropclick";

      var triangle = document.createElement("span");
      // triangle.innerHTML = "▼";
      // triangle.className += " dropclick";

      Dname.append(toUser);
      Dname.append(triangle);

    } else {
      var toUser = document.createElement("a");
      var img = document.createElement("img");
      img.src = "img/man.png";
      toUser.append(img);
      img.className += " dropclick";

      var triangle = document.createElement("span");
      // triangle.innerHTML = "▼";
      // triangle.className += " dropclick";

      Dname.append(toUser);
      Dname.append(triangle);

      // var i = user.email.indexOf("@");
      // Dname.innerHTML = user.email.slice(0,i)+"您好";
    }

    //gary
      var toNote = document.createElement('a');
      var noteImg = document.createElement('img');
      noteImg.src = "img/bell.png";
      toNote.appendChild(noteImg);
      noteImg.className += " dropclick";
      if(note!=null){
        note.appendChild(toNote);
      }
      noteId = user.uid;
      var i = 0;

      var noteref = firebase.database().ref('users/'+user.uid+'/notification');
      noteref.on('child_added', function(snap){
        var article = snap.val().article;
        var read = snap.val().read;
        var reader = snap.val().reader;
        var type = snap.val().type;
        notekey[i] = snap.getKey();
        i++;

       
        var detail = document.createElement('a');
        detail.className = "dropdown-item";
        detail.id = i;
        detail.href = "article.html?key="+article+"&Type="+snap.val().category;
      

        if (reader == user.displayName){


        }else{

        if(read==false){
          detail.style.backgroundColor = "lightseagreen"; 
          x++;
          document.querySelector('.notification-counter').innerHTML = x;
          document.querySelector('.notification-counter').style.display = '';
        };


        if(type=="like"){
          detail.innerText = reader+"說你的文章讚";
        }else{
          detail.innerText = reader+"對你的文章留言";
        };
        if(noteContent!=null){
          noteContent.prepend(detail);
        }


        }


      
      });
//gary
    // user.sendEmailVerification(); 送驗證信
  } else {
    user = null;
    var sign = document.createElement("span");
    sign.innerHTML = "立即註冊";
    console.log(sign);
    SignIn.append(sign);
    Dname.innerHTML = "";
    console.log("User is not logined yet.!");
  }
});

//登出
var signoutSmtBtn = document.getElementById("signoutSmtBtn");
signoutSmtBtn.addEventListener("click",function(){
  firebase.auth().signOut().then(function() {
    console.log("User sign out!");
    document.location.href='/index.html';
  }, function(error) {
    console.log("User sign out error!");
  })
},false);

//gary
console.log(notekey);
note.addEventListener("click",function(){
  if(notekey[0] != null){
    var updates = {};
    for(var j=0;j<notekey.length;j++){
        updates['users/'+noteId+'/notification/'+notekey[j]+'/read'] = true;
            }
    firebase.database().ref().update(updates);
    document.querySelector('.notification-counter').style.display = 'none';
    x = 0;

  }
});




