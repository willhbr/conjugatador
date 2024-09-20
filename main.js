const log = m => console.log(m);
const $ = q => document.querySelector(q);

// á é í ó

const DIOS_MIO = Array(6).fill('dios mio');
const PRESENT_ESTAR = 'estoy estas esta estamos estais estan'.split(' ');
const PAST_ESTAR = 'estaba estabas estaba estábamos estabais estaban'.split(' ');
const HABER = 'he has ha hemos habéis han'.split(' ');

const CONJES = {
  ar: {
    presente: '$o $as $a $amos $ais $an'.split(' '),
    preterito_indefinido: '$é $aste $ó $amos $astais $aron'.split(' '),
    preterito_imperfecto: '$aba $abas $aba $ábamos $abais $aban'.split(' '),
    past_continuous: PAST_ESTAR.map(c => c + ' $ando'),
    present_continuous: PRESENT_ESTAR.map(c => c + ' $ando'),
    past_participle: HABER.map(c => c + ' $ado'),
  },
  ir: {
    presente: '$o $es $e $emos $eis $en'.split(' '),
    preterito_indefinido: '$í $iste $ó $imos $isteis $ieron'.split(' '),
    preterito_imperfecto: '$ía $ías $ía $íamos $íais $ían'.split(' '),
    past_continuous: PAST_ESTAR.map(c => c + ' $iendo'),
    present_continuous: PRESENT_ESTAR.map(c => c + ' $iendo'),
    past_participle: HABER.map(c => c + ' $ido'),
  },
  er: {
    presente: '$o $es $e $imos $is $en'.split(' '),
    preterito_indefinido: '$í $iste $ó $imos $isteis $ieron'.split(' '),
    preterito_imperfecto: '$ía $ías $ía $íamos $íais $ían'.split(' '),
    past_continuous: PAST_ESTAR.map(c => c + ' $iendo'),
    present_continuous: PRESENT_ESTAR.map(c => c + ' $iendo'),
    past_participle: HABER.map(c => c + ' $ido'),
  },
}

const append = (root, conjugations) => conjugations.map(c => c.replace('$', root));

const fill = (verb, conj) => {
  if (!conj) { conj = {}; }
  let root = verb.substr(0, verb.length - 2);
  let type = verb.substr(verb.length - 2);
  let tenses = CONJES[type];
  if (!tenses) { return conj; }
  for (let tense of Object.keys(tenses)) {
    if (conj[tense] === null) {
      conj[tense] = DIOS_MIO;
    } else if (!conj[tense]) {
      conj[tense] = append(root, CONJES[type][tense]);
    }
  }
  return conj;
};

const to_idx = (person, plural) => +person + (plural == 'singular' ? 0 : 3);

const loaded = data => {
  for (let word of Object.keys(data)) {
    data[word] = fill(word, data[word]);
  }
  let word_index = 0;
  let update = () => {
    let person = $('input[name="person"]:checked').value;
    let plurality = $('input[name="plurality"]:checked').value;
    let idx = to_idx(person, plurality);
    let tense = $('input[name="tense"]:checked').value;
    let word = Object.keys(data)[word_index];
    let conjugated = data[word][tense][idx];
    let translated = data[word].english;
    $('#conjugation').innerText = conjugated;
    $('#translation').innerText = translated;
    $('#infinitive').innerText = word;
  };
  $('#next').addEventListener('click', () => {
    word_index += 1
    update();
  });
  Array.from(document.querySelectorAll('input')).forEach(input => input.addEventListener('change', () => update()));
  update();
};

window.addEventListener('load', () => {
  fetch("/conjugations.json").then(r => r.json()).then(loaded);
});
