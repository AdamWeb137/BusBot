from word_list import word_list
import random

def get_valid_input(cur_word):
    inp_str = f"Player's turn: {cur_word}"
    inp = input(inp_str).lower()
    alphabet = "abcdefghijklmnopqrstuvwxyz"
    while((not (inp in alphabet)) or len(inp) == 0):
        if(len(inp) == 0):
            inp = input(f"Please input a letter: {cur_word}").lower()
        elif(not (inp in alphabet)):
            inp = input(f"Input must be a letter of the alphabet: {cur_word}").lower()
    return inp

def yes_or_no(inp_str):
    inp = input(inp_str).lower()
    while(inp != "y" and inp != "n"):
        print("Please only input 'y' or 'n': ")
        inp = input(inp_str).lower()
    return inp == 'y'

def main():
    game_on = True
    player_turn = True
    start_range = 0
    end_range = len(word_list)-1
    cur_word = ""
    cpu_word = ""
    while game_on:
        if(player_turn):
            cur_word += get_valid_input(cur_word)
            player_turn = False
        else:
            word_range = get_leading_words(cur_word,start_range,end_range)
            if(word_range[0] == -1):
                if(cur_word in word_list):
                    print(f"The player has finished the word, {cur_word}, and has lost")
                else:
                    print(f"CPU calls player's bluff! According to my dictionary, no word begins with {cur_word}")
                print(f"CPU word was {cpu_word}")
                game_on = False
                continue
            start_range = word_range[0]
            end_range = word_range[1]
            allowed_indicies = []

            for i in range(start_range,end_range+1):
                w = word_list[i]
                if(len(w) < len(cur_word)):
                    continue
                if(((len(w) - len(cur_word)) % 2) != 0):
                    allowed_indicies.append(i)

            new_letter = ""
            if(len(allowed_indicies) == 0):
                death_word = word_list[start_range]
                new_letter = death_word[len(cur_word)]
                if(cur_word+new_letter == death_word):
                    print(f"CPU ends the word, '{death_word}'. Player wins!")
                    game_on = False
            else:
                random_index = random.randint(0,len(allowed_indicies)-1)
                random_word = word_list[allowed_indicies[random_index]]
                new_letter = random_word[len(cur_word)]
            cur_word += new_letter
            print(f"CPU chose the letter '{new_letter}'")
            word_range = get_leading_words(cur_word,start_range,end_range)
            start_range = word_range[0]
            end_range = word_range[1]
            cpu_word = word_list[random.randint(start_range,end_range)]
            player_turn = True

    if(yes_or_no("Would you like to play again (y/n): ")):
        main()

def get_leading_words(cur_word,start,end):
    start_index = -1
    ending_index = -1
    cur_len = len(cur_word)
    for j in range(start, end+1):
        word = word_list[j]
        if(len(word) <= cur_len):
            continue
        add_word = True
        for i in range(cur_len):
            if(word[i] != cur_word[i]):
                add_word = False
                break
        if(add_word):
            if(start_index == -1):
                start_index = j
            ending_index = j
    return (start_index,ending_index)


if __name__ == "__main__":
    # ran = get_leading_words("quen",140986,142051)
    # for i in range(ran[0],ran[1]+1):
    #     print(word_list[i])
    main()