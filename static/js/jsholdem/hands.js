'use strict';

const tests = [
  'straight_flush', 'four_of_a_kind', 'full_house', 'flush', 'straight',
  'three_of_a_kind', 'two_pair', 'one_pair', 'hi_card',
];

const get_winners = (my_players) => {
  let winners;
  for (let i = 0; i < tests.length; i++) {
    winners = winners_helper(my_players, tests[i]);
    if (winners) {
      break;
    }
  }
  return winners;
};

const execute_test = (string, player) => {
  if (string === 'test_straight_flush') {
    return test_straight_flush(player);
  }
  if (string === 'test_four_of_a_kind') {
    return test_four_of_a_kind(player);
  }
  if (string === 'test_full_house') {
    return test_full_house(player);
  }
  if (string === 'test_flush') {
    return test_flush(player);
  }
  if (string === 'test_straight') {
    return test_straight(player);
  }
  if (string === 'test_three_of_a_kind') {
    return test_three_of_a_kind(player);
  }
  if (string === 'test_two_pair') {
    return test_two_pair(player);
  }
  if (string === 'test_one_pair') {
    return test_one_pair(player);
  }
  if (string === 'test_hi_card') {
    return test_hi_card(player);
  }
  alert('execute_test() cannot tokenize ' + string);
};

const execute_compare = (string, hand_in, best_hand) => {
  if (string === 'compare_straight_flush') {
    return compare_straight_flush(hand_in, best_hand);
  }
  if (string === 'compare_four_of_a_kind') {
    return compare_four_of_a_kind(hand_in, best_hand);
  }
  if (string === 'compare_full_house') {
    return compare_full_house(hand_in, best_hand);
  }
  if (string === 'compare_flush') {
    return compare_flush(hand_in, best_hand);
  }
  if (string === 'compare_straight') {
    return compare_straight(hand_in, best_hand);
  }
  if (string === 'compare_three_of_a_kind') {
    return compare_three_of_a_kind(hand_in, best_hand);
  }
  if (string === 'compare_two_pair') {
    return compare_two_pair(hand_in, best_hand);
  }
  if (string === 'compare_one_pair') {
    return compare_one_pair(hand_in, best_hand);
  }
  if (string === 'compare_hi_card') {
    return compare_hi_card(hand_in, best_hand);
  }
  alert('execute_compare() cannot tokenize ' + string);
};

const winners_helper = (my_players, test) => {
  let best;
  let winners = new Array(my_players.length);
  for (var i = 0; i < my_players.length; i++) {
    if (!my_players[i]) {
      continue;
    }
    const a = execute_test('test_' + test, my_players[i]);
    const num_needed = a['num_needed'];
    if (num_needed > 0 || (num_needed === 0 && num_needed !== '0')) {
      continue;
    }
    if (typeof best === 'undefined') {
      best = a;
      winners = new Array(my_players.length);
      winners[i] = a;
    } else {
      const comp = execute_compare('compare_' + test, a, best);
      if (comp === 'a') {
        best = a;
        winners = new Array(my_players.length);
        winners[i] = a;
      } else if (comp === 'b') {
      } else if (comp === 'c') {
        winners[i] = a;
      }
    }
  }
  for (i = 0; i < winners.length; i++) {
    if (winners[i]) {
      return winners;
    }
  }
  return null;
};

const test_straight_flush = (player) => {
  const my_cards = group_cards(player);
  const the_suit = get_predominant_suit(my_cards);
  const working_cards = new Array(8);
  let working_index = 0;
  for (var i = 0; i < 7; i++) {
    if (get_suit(my_cards[i]) === the_suit) {
      const my_rank = get_rank(my_cards[i]);
      working_cards[working_index++] = my_rank;
      if (my_rank === 14) {
        working_cards[7] = 1; // ace==1 too
      }
    }
  }
  for (i = 0; i < working_cards.length; i++) {
    if (working_cards[i] == null) {
      working_cards[i] = -1; // FF
    }
  }
  working_cards.sort(compNum);
  let absolute_longest_stretch = 0;
  let absolute_hi_card = 0;
  let current_longest_stretch = 1;
  let current_hi_card = 0;
  for (i = 0; i < 8; i++) {
    const a = working_cards[i];
    const b = working_cards[i + 1];
    if (a && b && a - b === 1) {
      current_longest_stretch++;
      if (current_hi_card < 1) current_hi_card = a;
    } else if (a) {
      if (current_longest_stretch > absolute_longest_stretch) {
        absolute_longest_stretch = current_longest_stretch;
        if (current_hi_card < 1) current_hi_card = a;
        absolute_hi_card = current_hi_card;
      }
      current_longest_stretch = 1;
      current_hi_card = 0;
    }
  }
  let num_mine = 0;
  for (i = 0; i < absolute_longest_stretch; i++) {
    if (the_suit + (absolute_hi_card - i) === player.carda || the_suit + (absolute_hi_card - i) === player.cardb) num_mine++;
  }
  const hash_result = {};
  hash_result['straight_hi'] = absolute_hi_card;
  hash_result['num_needed'] = 5 - absolute_longest_stretch;
  hash_result['num_mine'] = num_mine;
  hash_result['hand_name'] = 'Straight Flush';

  return hash_result;
};

const compare_straight_flush = (a, b) => compare_straight(a, b);

const test_four_of_a_kind = (player) => {
  let i;
  const my_cards = group_cards(player);
  const ranks = new Array(13);
  for (i = 0; i < 13; i++) {
    ranks[i] = 0;
  }
  for (i = 0; i < my_cards.length; i++) {
    ranks[get_rank(my_cards[i]) - 2]++;
  }
  let four = '';
  let kicker = '';
  for (i = 0; i < 13; i++) {
    if (ranks[i] === 4) {
      four = i + 2;
    } else if (ranks[i] > 0) {
      kicker = i + 2;
    }
  }
  let num_mine = 0;
  if (get_rank(player.carda) === four) {
    num_mine++;
  }
  if (get_rank(player.cardb) === four) {
    num_mine++;
  }
  let num_needed = 4;
  if (four) {
    num_needed = 0;
  }

  const hash_result = {};
  hash_result['rank'] = four;
  hash_result['kicker'] = kicker;
  hash_result['num_needed'] = num_needed;
  hash_result['num_mine'] = num_mine;
  hash_result['hand_name'] = 'Four of a Kind';

  return hash_result;
};

const compare_four_of_a_kind = (a, b) => {
  const rank_a = a['rank'];
  const rank_b = b['rank'];
  if (rank_a > rank_b) return 'a';
  else if (rank_b > rank_a) return 'b';
  else {
    const kicker_a = a['kicker'];
    const kicker_b = b['kicker'];
    if (kicker_a > kicker_b) return 'a';
    else if (kicker_b > kicker_a) return 'b';
    else return 'c';
  }
};

const test_full_house = (player) => {
  const my_cards = group_cards(player);
  const ranks = new Array(13);
  let i;
  for (i = 0; i < 13; i++) {
    ranks[i] = 0;
  }
  for (i = 0; i < my_cards.length; i++) {
    ranks[get_rank(my_cards[i]) - 2]++;
  }
  let three = '';
  let two = '';
  for (i = 0; i < 13; i++) {
    if (ranks[i] === 3) {
      if (three > two) {
        two = three;
      }
      three = i + 2;
    } else if (ranks[i] === 2) {
      two = i + 2;
    }
  }
  let num_needed = 5;
  let major_rank = '';
  let num_mine_major = 0;
  if (three) {
    num_needed -= 3;
    major_rank = three;
    if (get_rank(player.carda) === three) num_mine_major += 1;
    if (get_rank(player.cardb) === three) num_mine_major += 1;
  }
  const hash_result = {};
  hash_result['major_rank'] = major_rank;
  hash_result['num_mine_major'] = num_mine_major;

  let minor_rank = '';
  let num_mine_minor = 0;
  if (two) {
    num_needed -= 2;
    minor_rank = two;
    if (get_rank(player.carda) === two) num_mine_minor += 1;
    if (get_rank(player.cardb) === two) num_mine_minor += 1;
  }
  hash_result['minor_rank'] = minor_rank;
  hash_result['num_mine_minor'] = num_mine_minor;
  hash_result['num_mine'] = num_mine_minor + num_mine_major;
  hash_result['num_needed'] = num_needed;
  hash_result['hand_name'] = 'Full House';

  return hash_result;
};

const compare_full_house = (a, b) => {
  const major_a = a['major_rank'];
  const major_b = b['major_rank'];
  if (major_a > major_b) return 'a';
  else if (major_b > major_a) return 'b';
  else {
    const minor_a = a['minor_rank'];
    const minor_b = b['minor_rank'];
    if (minor_a > minor_b) return 'a';
    else if (minor_b > minor_a) return 'b';
    else return 'c';
  }
};

const test_flush = (player) => {
  let i;
  const my_cards = group_cards(player);
  const the_suit = get_predominant_suit(my_cards);
  const working_cards = new Array(7);
  let working_index = 0;
  let num_in_flush = 0;
  for (i = 0; i < my_cards.length; i++) {
    if (get_suit(my_cards[i]) === the_suit) {
      num_in_flush++;
      working_cards[working_index++] = get_rank(my_cards[i]);
    }
  }
  for (i = 0; i < working_cards.length; i++) {
    if (working_cards[i] == null) {
      working_cards[i] = -1; // FF
    }
  }
  working_cards.sort(compNum);
  const hash_result = {};

  let num_mine = 0;
  for (i = 0; i < 5; i++) {
    let s = working_cards[i];
    if (!s) s = '';
    hash_result['flush_' + i] = s;
    if (the_suit + working_cards[i] === player.carda || the_suit + working_cards[i] === player.cardb) num_mine++;
  }
  hash_result['num_needed'] = 5 - num_in_flush;
  hash_result['num_mine'] = num_mine;
  hash_result['suit'] = the_suit;
  hash_result['hand_name'] = 'Flush';

  return hash_result;
};

const compare_flush = (a, b) => {
  for (let i = 0; i < 5; i++) {
    const flush_a = a['flush_' + i];
    const flush_b = b['flush_' + i];
    if (flush_a > flush_b) {
      return 'a';
    } else if (flush_b > flush_a) {
      return 'b';
    }
  }
  return 'c';
};

const test_straight = (player) => {
  let i;
  const my_cards = group_cards(player);
  const working_cards = new Array(8);
  const ranks = new Array(13);
  for (i = 0; i < 7; i++) {
    const my_rank = get_rank(my_cards[i]);
    if (ranks[my_rank - 2]) continue;
    else ranks[my_rank - 2] = 1;
    working_cards[i] = my_rank;
    if (my_rank === 14) {
      working_cards[7] = 1; // ace==1 too
    }
  }
  for (i = 0; i < working_cards.length; i++) {
    if (working_cards[i] == null) {
      working_cards[i] = -1; // FF
    }
  }
  working_cards.sort(compNum);
  let absolute_longest_stretch = 0;
  let absolute_hi_card = 0;
  let current_longest_stretch = 1;
  let current_hi_card = 0;
  for (i = 0; i < 8; i++) {
    const a = working_cards[i];
    const b = working_cards[i + 1];
    if (a && b && a - b == 1) {
      current_longest_stretch++;
      if (current_hi_card < 1) {
        current_hi_card = a;
      }
    } else if (a) {
      if (current_longest_stretch > absolute_longest_stretch) {
        absolute_longest_stretch = current_longest_stretch;
        if (current_hi_card < 1) {
          current_hi_card = a;
        }
        absolute_hi_card = current_hi_card;
      }
      current_longest_stretch = 1;
      current_hi_card = 0;
    }
  }
  let num_mine = 0;
  for (i = 0; i < absolute_longest_stretch; i++) {
    if (absolute_hi_card - i === get_rank(player.carda) ||
        absolute_hi_card - i === get_rank(player.cardb)) {
      num_mine++;
    }
  }
  const hash_result = {};
  hash_result['straight_hi'] = absolute_hi_card;
  hash_result['num_needed'] = 5 - absolute_longest_stretch;
  hash_result['num_mine'] = num_mine;
  hash_result['hand_name'] = 'Straight';
  return hash_result;
};

const compare_straight = (a, b) => {
  const hi_a = a['straight_hi'];
  const hi_b = b['straight_hi'];
  if (hi_a > hi_b) {
    return 'a';
  } else if (hi_b > hi_a) {
    return 'b';
  } else {
    return 'c';
  }
};

const test_three_of_a_kind = (player) => {
  let i;
  const my_cards = group_cards(player);
  const ranks = new Array(13);
  for (i = 0; i < 13; i++) {
    ranks[i] = 0;
  }
  for (i = 0; i < my_cards.length; i++) {
    ranks[get_rank(my_cards[i]) - 2]++;
  }
  let three = '';
  let kicker_1 = '';
  let kicker_2 = '';
  for (i = 0; i < 13; i++) {
    if (ranks[i] === 3) {
      three = i + 2;
    } else if (ranks[i] === 1) {
      kicker_2 = kicker_1;
      kicker_1 = i + 2;
    } else if (ranks[i] > 1) {
      kicker_1 = i + 2;
      kicker_2 = i + 2;
    }
  }
  let num_mine = 0;
  if (get_rank(player.carda) === three) {
    num_mine++;
  }
  if (get_rank(player.cardb) === three) {
    num_mine++;
  }
  let num_needed = 3;
  if (three) {
    num_needed = 0;
  }
  const hash_result = {};
  hash_result['rank'] = three;
  hash_result['num_needed'] = num_needed;
  hash_result['num_mine'] = num_mine;
  hash_result['kicker_1'] = kicker_1;
  hash_result['kicker_2'] = kicker_2;
  hash_result['hand_name'] = 'Three of a Kind';
  return hash_result;
};

const compare_three_of_a_kind = (a, b) => {
  const rank_a = a['rank'];
  const rank_b = b['rank'];
  if (rank_a > rank_b) {
    return 'a';
  }
  if (rank_b > rank_a) {
    return 'b';
  }
  let kicker_a = a['kicker_1'];
  let kicker_b = b['kicker_1'];
  if (kicker_a > kicker_b) {
    return 'a';
  }
  if (kicker_b > kicker_a) {
    return 'b';
  }
  kicker_a = a['kicker_2'];
  kicker_b = b['kicker_2'];
  if (kicker_a > kicker_b) {
    return 'a';
  }
  if (kicker_b > kicker_a) {
    return 'b';
  }
  return 'c';
};

const test_two_pair = (player) => {
  let i;
  const my_cards = group_cards(player);
  const ranks = new Array(13);
  for (i = 0; i < 13; i++) ranks[i] = 0;
  for (i = 0; i < my_cards.length; i++) ranks[get_rank(my_cards[i]) - 2]++;
  let first = '';
  let second = '';
  let kicker = '';
  for (i = 12; i > -1; i--) {
    if (ranks[i] === 2) {
      if (!first) {
        first = i + 2;
      } else if (!second) {
        second = i + 2;
      } else if (!kicker) {
        kicker = i + 2;
      } else {
        break;
      }
    } else if (!kicker && ranks[i] > 0) {
      kicker = i + 2;
    }
  }
  let num_mine = 0;
  if (get_rank(player.carda) === first || get_rank(player.carda) === second) {
    num_mine++;
  }
  if (get_rank(player.cardb) === first || get_rank(player.cardb) === second) {
    num_mine++;
  }
  let num_needed = 2;
  if (second) num_needed = 0;
  else if (first) num_needed = 1;
  else num_needed = 2;
  const hash_result = {};
  hash_result['rank_1'] = first;
  hash_result['rank_2'] = second;
  hash_result['num_needed'] = num_needed;
  hash_result['num_mine'] = num_mine;
  hash_result['kicker'] = kicker;
  hash_result['hand_name'] = 'Two Pair';
  return hash_result;
};

const compare_two_pair = (a, b) => {
  let rank_a = a['rank_1'];
  let rank_b = b['rank_1'];
  if (rank_a > rank_b) {
    return 'a';
  }
  if (rank_b > rank_a) {
    return 'b';
  }
  rank_a = a['rank_2'];
  rank_b = b['rank_2'];
  if (rank_a > rank_b) {
    return 'a';
  }
  if (rank_b > rank_a) {
    return 'b';
  }
  const kicker_a = a['kicker'];
  const kicker_b = b['kicker'];
  if (kicker_a > kicker_b) {
    return 'a';
  }
  if (kicker_b > kicker_a) {
    return 'b';
  }
  return 'c';
};

const test_one_pair = (player) => {
  let i;
  const my_cards = group_cards(player);
  const ranks = new Array(13);
  for (i = 0; i < 13; i++) {
    ranks[i] = 0;
  }
  for (i = 0; i < my_cards.length; i++) {
    ranks[get_rank(my_cards[i]) - 2]++;
  }
  let pair = 0;
  let kicker_1 = '';
  let kicker_2 = '';
  let kicker_3 = '';
  for (i = 0; i < 13; i++) {
    if (ranks[i] == 2) {
      pair = i + 2;
    } else if (ranks[i] == 1) {
      kicker_3 = kicker_2;
      kicker_2 = kicker_1;
      kicker_1 = i + 2;
    } else if (ranks[i] > 2) {
      kicker_1 = i + 2;
      kicker_2 = i + 2;
      kicker_3 = i + 2;
    }
  }
  let num_mine = 0;
  if (get_rank(player.carda) === pair) num_mine++;
  if (get_rank(player.cardb) === pair) num_mine++;
  let num_needed = 1;
  if (pair) num_needed = 0;
  const hash_result = {};
  hash_result['rank'] = pair;
  hash_result['num_needed'] = num_needed;
  hash_result['num_mine'] = num_mine;
  hash_result['kicker_1'] = kicker_1;
  hash_result['kicker_2'] = kicker_2;
  hash_result['kicker_3'] = kicker_3;
  hash_result['hand_name'] = 'One Pair';

  return hash_result;
};

const compare_one_pair = (a, b) => {
  const rank_a = a['rank'];
  const rank_b = b['rank'];
  if (rank_a > rank_b) {
    return 'a';
  }
  if (rank_b > rank_a) {
    return 'b';
  }
  let kicker_a = a['kicker_1'];
  let kicker_b = b['kicker_1'];
  if (kicker_a > kicker_b) {
    return 'a';
  }
  if (kicker_b > kicker_a) {
    return 'b';
  }
  kicker_a = a['kicker_2'];
  kicker_b = b['kicker_2'];
  if (kicker_a > kicker_b) {
    return 'a';
  }
  if (kicker_b > kicker_a) {
    return 'b';
  }
  kicker_a = a['kicker_3'];
  kicker_b = b['kicker_3'];
  if (kicker_a > kicker_b) {
    return 'a';
  }
  if (kicker_b > kicker_a) {
    return 'b';
  }
  return 'c';
};

const test_hi_card = (player) => {
  let i;
  const my_cards = group_cards(player);
  const working_cards = new Array(my_cards.length);
  for (i = 0; i < working_cards.length; i++) {
    working_cards[i] = get_rank(my_cards[i]);
  }
  for (i = 0; i < working_cards.length; i++) {
    if (working_cards[i] == null) {
      working_cards[i] = -1;
    }
  }
  working_cards.sort(compNum);
  const hash_result = {};
  for (i = 0; i < 5; i++) {
    if (!working_cards[i]) {
      working_cards[i] = '';
    }
    hash_result['hi_card_' + i] = working_cards[i];
  }
  hash_result['num_needed'] = 0;
  hash_result['hand_name'] = 'High Card';
  return hash_result;
};

const compare_hi_card = (a, b) => {
  for (let i = 0; i < 5; i++) {
    const hi_a = a['hi_card_' + i];
    const hi_b = b['hi_card_' + i];
    if (hi_a > hi_b) return 'a';
    if (hi_b > hi_a) return 'b';
  }
  return 'c';
};

const get_suit = (card) => card ? card.substring(0, 1) : '';

const get_rank = (card) => card ? card.substring(1) - 0 : '';

const get_predominant_suit = (my_cards) => {
  const suit_count = [0, 0, 0, 0];
  for (let i = 0; i < my_cards.length; i++) {
    const s = get_suit(my_cards[i]);
    if (s === 'c') suit_count[0]++;
    else if (s === 's') suit_count[1]++;
    else if (s === 'h') suit_count[2]++;
    else if (s === 'd') suit_count[3]++;
  }
  let suit_index = 0;
  if (suit_count[1] > suit_count[suit_index]) suit_index = 1;
  if (suit_count[2] > suit_count[suit_index]) suit_index = 2;
  if (suit_count[3] > suit_count[suit_index]) suit_index = 3;
  if (suit_index === 0) return 'c';
  if (suit_index === 1) return 's';
  if (suit_index === 2) return 'h';
  if (suit_index === 3) return 'd';
  return '';
};

const group_cards = (player) => {
  const c = new Array(7);
  for (let i = 0; i < 5; i++) {
    c[i] = board[i];
  }
  c[5] = player.carda;
  c[6] = player.cardb;
  return c;
};

const compNum = (a, b) => b - a;
