class Chatbox {
    constructor() {
        this.args = {
            openButton: document.querySelector('.chatbox__button'),
            chatBox: document.querySelector('.chatbox__support'),
            sendButton: document.querySelector('.send__button')
        }

        this.state = false;
        this.messages = [];
    }

    display() {
        const {openButton, chatBox, sendButton} = this.args;

        openButton.addEventListener('click', () => this.toggleState(chatBox))

        sendButton.addEventListener('click', () => this.onSendButton(chatBox))

        const node = chatBox.querySelector('input');
        node.addEventListener("keyup", ({key}) => {
            if (key === "Enter") {
                this.onSendButton(chatBox)
            }
        })
    }

    toggleState(chatbox) {
        this.state = !this.state;

        // show or hides the box
        if(this.state) {
            chatbox.classList.add('chatbox--active');
            document.querySelector('.chatbox__footer .form input').focus();
            this.check_svg(chatbox);
        } else {
            chatbox.classList.remove('chatbox--active')
        }
    }


    // _parseJSON(response) {
    //     return response.text().then(function (text) {
    //         return isJSON(text) ? JSON.parse(text) : {}
    //     })
    // };

    async fetch_response(datajs){
        // let response = await fetch('https://arsh22ji.pythonanywhere.com/predict', {
        let response = await fetch('http://127.0.0.1:5000/predict', {
            method: 'POST',
            body: datajs,
            mode: "cors",
            headers: {
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Credentials" : true,
                'Content-Type': 'application/json'
            },
          });
        // console.log("here",await response);
        let data = await response.json();
        // console.log("data = ",data);
        return data;
    }

    async onSendButton(chatbox) {
        // var textField = chatbox.querySelector('.chatbox__footer>input');
        var textField = chatbox.querySelector('input');
        let text1 = textField.value;
        if (text1 === "") {
            return;
        }

        let msg1 = { name: "User", message: text1 }
        this.messages.push(msg1);
        this.messages.push("<div class='typing-loader'></div>");
        this.updateChatText(chatbox, true);
        // this.typing(chatbox, true);
        textField.value = '';
        var datajs = JSON.stringify({ "message": text1 });

        try{
            await this.fetch_response(datajs).then(data => {
                let msg2 = { name: "Sam", message: data.answer };
                this.messages.push(msg2);
                this.updateChatText(chatbox, false);
                // this.typing(chatbox, false);
            }).catch(err => {
                this.messages.push("Something went wrong!! Try again later...");
                this.updateChatText(chatbox, false);
                // console.clear();
                console.log(err);
            });
        }
        catch(err){}
    }

    check_svg(chatBox){
        document.querySelectorAll('svg').forEach(function(item, index) {
            try{
              if(item.nextElementSibling.tagName === 'BR'){
                item.nextElementSibling.remove();
              }
              if(item.nextElementSibling.tagName === 'PATH'){
                  item.innerHTML += item.nextElementSibling.outerHTML;
              }
            }
            catch(e){}
        });
    }

    updateChatText(chatbox, isTyping) {
        var html = '';
        if (!isTyping){
            document.querySelector('.typing-loader').parentNode.remove();
            this.messages.splice(this.messages.indexOf("<div class='typing-loader'></div>"),1);
        }
        this.messages.slice().reverse().forEach(function(item, index) {
            if (item.name === "Sam")
            {
                html += '<div class="messages__item messages__item--visitor">' + item.message + '</div>';
            }
            else
            {
                if (typeof item === 'string'){
                    html += '<div class="messages__item messages__item--visitor">' + item + '</div>';
                }
                if(typeof item === 'object'){
                    html += '<div class="messages__item messages__item--operator">' + item.message + '</div>';
                }
            }
          });

        const chatmessage = chatbox.querySelector('.chatbox__messages');
        chatmessage.innerHTML = html;
    }
}


const chatbox = new Chatbox();
chatbox.display();
chatbox.check_svg(chatbox);

window.onload = function() {
    chatbox.check_svg(chatbox);
};

[document.querySelector('.label'),document.querySelector('.arrow')].forEach(function(item) {
    var names = document.querySelector('.names');
    var arrow = document.querySelector('.arrow');
    item.addEventListener('click', function() {
        if(names.classList.contains('hide')) {
            names.classList.remove('hide');
            names.classList.add('show');
            arrow.classList.remove('angle-down');
            arrow.classList.add('angle-up');
        }
        else {
            names.classList.add('hide');
            names.classList.remove('show');
            arrow.classList.add('angle-down');
            arrow.classList.remove('angle-up');
        }
    }); 
});
