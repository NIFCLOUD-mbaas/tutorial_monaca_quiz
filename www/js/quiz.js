// This is a JavaScript file

//ページの初期化が完了したら実行される
$(function (){
    console.log("init!");
    //mobile backendのAPIキーを設定
    NCMB.initialize("YOUR_APIKEY","YOUR_CLIENTKEY");
    
    //クイズを表示するイベントを登録
    $(document.body).on('pageinit', '#answer_page', function() {refreshQuiz();});
    
    //クイズ作成ボタンを表示するイベトを登録
    //HTMLに記述したボタンはJSで操作できない
    $(document.body).on('pageinit', '#create_quiz_page', function() {displayButton();});
    
});

//ログイン済みかを確認する
function checkCurrentUser(){
    //画面遷移時のアニメーションを設定
    var options = {
        animation: 'lift', // アニメーションの種類
        onTransitionEnd: function() {} // アニメーションが完了した際によばれるコールバック
    };
    
    if (NCMB.User.current()){
        //ログイン済みであればメニューの表示
        quizNavi.pushPage("menu.html", options);
    } else {
        //未ログインの場合はログイン画面を表示
        quizNavi.pushPage("login.html", options)
    }
}

//会員登録・ログインを行う
function userLogin(signUpFlag){
    //入力フォームからユーザー名とパスワードを取得
    var userName = $("#user_name").val();
    var password = $("#password").val();
    
    //会員登録・ログインを実行したあとのコールバックを設定
    var callBack = {
        success: function (user){
            //メニュー画面に遷移
            quizNavi.pushPage("menu.html");
        },
        error: function (user, error){
            //エラーコードの表示
            $("#login_error_msg").text("errorCode:" + error.code + ", errorMessage:" + error.message);
        }
    };
    

    if (signUpFlag === false){
        //ログイン処理を実行し、上で設定されたコールバックが実行される
        NCMB.User.logIn(userName, password, callBack);
    } else {
        //会員のインスタンスを作成
        var user = new NCMB.User();
        
        //ユーザー名とパスワードとスコアをインスタンスに設定
        user.set("userName", userName);
        user.set("password", password);
        user.set("score", 0);
        
        //会員登録を実行し、上で設定されたコールバックが実行される
        user.signUp(null, callBack);        
    }
}

//ログアウトを実行し、ホーム画面に遷移させる
function logout(){
    NCMB.User.logOut();
    quizNavi.resetToPage("home.html");
}

//クイズ作成画面に登録ボタンを設置する
function displayButton(){
    console.log("display");
    var btn = $("<ons-button id='create_quiz_button' onclick='createQuiz()'>クイズを登録!</ons-button>");
    btn.appendTo($("#create_button_area"));
    ons.compile(btn[0]);
}


//クイズをmobile backendに登録する
function createQuiz(){
    
    //フォームからクイズの内容を取得する
    var quizText = $("#quiz_text").val();
    var answer = $("#answer").val();
    var option1 = $("#option1").val();
    var option2 = $("#option2").val();
    var option3 = $("#option3").val();
    
    //空の要素がないことを確認する
    if (quizText !== "" && answer !== "" &&
        option1 !== "" && option2 !== "" && option3 !== ""){
        //クイズクラスのインスタンスを作成する
        var QuizClass = NCMB.Object.extend("Quiz");
        var quiz = new QuizClass();
        
        //取得したクイズの内容をセットする
        quiz.set("quizText", quizText);
        quiz.set("answer", answer);
        quiz.set("options", []);    //addする前に空配列での初期化が必要
        quiz.add("options", option1);
        quiz.add("options", option2);
        quiz.add("options", option3);
        
        //mobile bakcendにクイズを登録する
        quiz.save(null, {
            success: function (quiz){
                $("#create_button_area").hide();
                $("#created_message").text("クイズの作成が完了しました！");
                //スコアの更新が完了したら、メニュー画面に遷移するボタンを表示させる
                var btn = $("<ons-button onclick='quizNavi.resetToPage(\"menu.html\")'>メニューに戻る</ons-button>");
                btn.appendTo($("#created_message"));
                ons.compile(btn[0]);
            },
            error: function (quiz, error){
                $("#created_message").text("error:" + error.message);
            }
        });
        
    }
}

//クイズ画面をリフレッシュする
function refreshQuiz(){
    $("#answer_options").html("");
    
    selectQuiz();
}

//連続正解数を保持するグローバル変数
var score = 0;

//正誤判定を行う
function answerQuiz(selectedOptions){
    //選択肢を非表示にする
    $("#answer_options").hide();
    
    if (answerText === selectedOptions) {
        //正解時に○を出す
        $("#question").append("<br/><img src='images/maru.png'><br/>" + (score+1) + "問連続正解中！");
        
        //次の問題を開くボタンを表示する
        var btn = $("<ons-button onclick='refreshQuiz()'>次の問題</ons-button>");
        btn.appendTo($("#question"));
        ons.compile(btn[0]);
        
        //連続正解数を更新する
        score++;
    } else {
        //間違い時に×を出す
        $("#question").append("<br/><img src='images/batsu.png'><br/>");
        
        //間違い時に端末を振動させる
        //navigator.notification.vibrate(1000);
        
        //ログイン中の会員に連続正解数を設定
        var user = NCMB.User.current();
        user.set("score", score);
        score = 0;
        user.save(null, {
            success: function (){
                //スコアの更新が完了したら、メニュー画面に遷移するボタンを表示させる
                var btn = $("<ons-button onclick='quizNavi.resetToPage(\"menu.html\")'>メニューに戻る</ons-button>");
                btn.appendTo($("#question"));
                ons.compile(btn[0]);
            },
            error: function (obj, error){
                console.log("error:" + error.message);
            }
        });
    }
}

//mobile backendから取得したクイズの正解を保持する変数
var answerText = null;

//クイズを表示するメソッド
function displayQuiz(quiz){
    //問題文を表示
    $("#question").text(quiz.get("quizText"));
    
    //選択肢を表示する部分が見えるようにする
    $("#answer_options").show();
    
    //選択肢が入っている配列の末尾に正解を追加する
    var array = quiz.get("options");
    array[3] = quiz.get("answer");
    
    //正解とダミーの選択肢をランダムに入れ替える
    var index = Math.floor(Math.random() * 3);
    var tmp = array[index];
    array[index] = array[3];
    array[3] = tmp;
    
    //正解を含んだ選択肢の配列を表示する
    for (var i = 0; i < 4; i++){
        var btn = $("<ons-button onclick=\"answerQuiz('" + array[i] + "')\">" + array[i] + "</ons-button>");
        btn.appendTo($("#answer_options"));
        ons.compile(btn[0]);
    }
    
    //選択肢がタッチされたときに正誤判定を行うため、正解を保持する
    answerText = quiz.get("answer");
}