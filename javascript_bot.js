const main = ()=>{
    
    let info, inp;
    let cur_word, start_range, end_range, cpu_word, game_on;
    const new_game = ()=>{
        cur_word = "";
        start_range = 0;
        end_range = word_list.length - 1;
        cpu_word = "";
        game_on = true;
    };
    new_game();

    const get_leading_words = (start,end)=>{
        console.log([start,end]);
        let start_index = -1;
        let ending_index = -1;
        let cur_len = cur_word.length;
        for(let j = start; j < end+1; j++){
            let word = word_list[j];
            if(word.length <= cur_len) continue;
            let add_word = true;
            for(let i = 0; i < cur_len; i++){
                if(word[i] != cur_word[i]){
                    add_word = false;
                    break;
                }
            }
            if(add_word){
                if(start_index == -1) start_index = j;
                ending_index = j;
            }
        }
        return [start_index,ending_index];
    };

    const set_info = (txt)=>{
        info.innerHTML = txt;
    };

    const end_game = ()=>{
        game_on = false;
        inp.value = "";
    };

    const update_word = ()=>{
        document.querySelector("#word").innerHTML = cur_word.toUpperCase();
    }

    const cpu_turn = ()=>{
        update_word();
        let word_range = get_leading_words(start_range,end_range);
        if(word_range[0] == -1){
            if(word_list.indexOf(cur_word) > -1){
                set_info(`The player has finished the word, ${cur_word}, and has lost`);
            } else {
                set_info(`CPU calls player's bluff! According to my dictionary, no word begins with ${cur_word}! CPU word was ${cpu_word}`);
            }
            end_game();
            return;
        }
        start_range = word_range[0];
        end_range = word_range[1];
        let allowed_indicies = [];
        for(let i = start_range; i < end_range+1; i++){
            let w = word_list[i];
            if(w.length < cur_word.length) continue;
            if(((w.length-cur_word.length) % 2) != 0) allowed_indicies.push(i);
        }
        let new_letter = "";
        if(allowed_indicies.length == 0){
            let death_word = word_list[start_range];
            new_letter = death_word[cur_word.length];
            if(cur_word+new_letter == death_word){
                set_info(`CPU ends the word, '${death_word}'. Player wins!`);
                end_game();
                return;
            }
        } else {
            let random_index = Math.floor(Math.random()*allowed_indicies.length);
            let random_word = word_list[allowed_indicies[random_index]]
            new_letter = random_word[cur_word.length];
        }
        cur_word += new_letter;
        set_info(`CPU chose the letter '${new_letter}'`);
        word_range = get_leading_words(start_range,end_range);
        start_range = word_range[0];
        end_range = word_range[1];
        cpu_word = word_list[start_range + Math.floor(Math.random()*(end_range-start_range))];
        update_word();
        inp.value = "";
        inp.focus();
    };

    window.addEventListener("load",(e)=>{
        info = document.querySelector("p#info");
        inp = document.querySelector("input[name='letter']");
        const btn = document.querySelector("button[name='add']");
        btn.addEventListener("click",(ev)=>{
            if(!game_on) return;
            let l = inp.value;
            let alphabet = "abcdefghijklmnopqrstuvwxyz";
            if(l.length == 0){
                alert("Please enter a letter");
                return;
            }
            if(!alphabet.includes(l.toLowerCase())){
                alert("Please only input a letter");
                return;
            }
            cur_word += l;
            cpu_turn();
        });
        document.querySelector("button#new_game").addEventListener("click",() => {
            new_game();
            update_word();
            set_info("");
        });
    });
};
main();