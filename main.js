const log = m => console.log(m);
const $ = q => document.querySelector(q);
const $$ = q => document.querySelectorAll(q);

const replacing_first = (f, t, not) =>
  (root) => {
    let repl = root.replace(f, t);
    let arr = Array(6).fill(repl);
    not.forEach(i => arr[i] = root);
    return arr;
  };
    
const replacing_last = (f, t, not) =>
  (root) => {
    let idx = root.lastIndexOf(f);
    let repl = root.substr(0, idx) + t + root.substr(idx + f.length);
    let arr = Array(6).fill(repl);
    not.forEach(i => arr[i] = root);
    return arr;
  };

const TRANSFORMS = {
  'none': (root) => Array(6).fill(root),
  'e/i': replacing_first('e', 'i', [3, 4]),
  'e/ie': replacing_first('e', 'ie', [3, 4]),
  'e/ie2': replacing_last('e', 'ie', [3, 4]),
  'o/u': replacing_first('o', 'ue', [2, 5]),
  'o/ue': replacing_first('o', 'ue', [3, 4]),
  'u/ue': replacing_first('u', 'ue', [3, 4]),
  'ue/uie': replacing_first('ue', 'uie', [3, 4]),
};


const DIOS_MIO = Array(6).fill('dios mio');
const PRESENT_ESTAR = 'estoy estas esta estamos estais estan'.split(' ');
const PAST_ESTAR = 'estaba estabas estaba estábamos estabais estaban'.split(' ');
const FUTURE_ESTAR = 'estaré estarás estará estaremos estaréis estarán'.split(' ');
const HABER_PAST = 'he has ha hemos habéis han'.split(' ');
const HABER_FUTURE = 'habré habrás habrá habremos habréis habrán'.split(' ');
const HABER_CONDITIONAL = 'habría habrías habría habríamos habríais habrían'.split(' ');
const REFLEXTIVOS = 'me te se nos os se'.split(' ');
const FUTURE_GO = 'voy vas va vamos vais van'.split(' ');

const append = (roots, conjugations, refl) =>
  conjugations.map((c, i) => (refl ? REFLEXTIVOS[i] + ' ' : '') + c.replace('$', roots[i]));

const CONJES = {
  ar: {
    presente: '$o $as $a $amos $ais $an'.split(' '),
    preterito_indefinido: '$é $aste $ó $amos $astais $aron'.split(' '),
    preterito_imperfecto: '$aba $abas $aba $ábamos $abais $aban'.split(' '),
    past_continuous: PAST_ESTAR.map(c => c + ' $ando'),
    present_continuous: PRESENT_ESTAR.map(c => c + ' $ando'),
    future_continuous: FUTURE_ESTAR.map(c => c + ' $ando'),
    past_participle: HABER_PAST.map(c => c + ' $ado'),
    future_ir: FUTURE_GO.map(c => c + ' a $ar'),
    future: '$aré $arás $ará $aremos $aréis $arán'.split(' '),
    future_perfect: HABER_FUTURE.map(c => c + ' $ado'),
    condicional_perfecto: HABER_CONDITIONAL.map(c => c + ' $ado'),
    condicional_simple: '$aría $arías $aría $aríamos $aríais $arían'.split(' '),
  },
  er: {
    presente: '$o $es $e $imos $is $en'.split(' '),
    preterito_indefinido: '$í $iste $ó $imos $isteis $ieron'.split(' '),
    preterito_imperfecto: '$ía $ías $ía $íamos $íais $ían'.split(' '),
    past_continuous: PAST_ESTAR.map(c => c + ' $iendo'),
    present_continuous: PRESENT_ESTAR.map(c => c + ' $iendo'),
    future_continuous: FUTURE_ESTAR.map(c => c + ' $iendo'),
    past_participle: HABER_PAST.map(c => c + ' $ido'),
    future_ir: FUTURE_GO.map(c => c + ' a $er'),
    future: '$eré $erás $erá $eremos $eréis $erán'.split(' '),
    future_perfect: HABER_FUTURE.map(c => c + ' $ido'),
    condicional_perfecto: HABER_CONDITIONAL.map(c => c + ' $ido'),
    condicional_simple: '$ería $erías $ería $eríamos $eríais $erían'.split(' '),
  },
  ir: {
    presente: '$o $es $e $emos $eis $en'.split(' '),
    preterito_indefinido: '$í $iste $ó $imos $isteis $ieron'.split(' '),
    preterito_imperfecto: '$ía $ías $ía $íamos $íais $ían'.split(' '),
    past_continuous: PAST_ESTAR.map(c => c + ' $iendo'),
    present_continuous: PRESENT_ESTAR.map(c => c + ' $iendo'),
    future_continuous: FUTURE_ESTAR.map(c => c + ' $iendo'),
    past_participle: HABER_PAST.map(c => c + ' $ido'),
    future_ir: FUTURE_GO.map(c => c + ' a $ir'),
    future: '$iré $irás $irá $iremos $iréis $irán'.split(' '),
    future_perfect: HABER_FUTURE.map(c => c + ' $ido'),
    condicional_perfecto: HABER_CONDITIONAL.map(c => c + ' $ido'),
    condicional_simple: '$iría $irías $iría $iríamos $iríais $irían'.split(' '),
  },
}

const fill = (verb, conj) => {
  if (!conj) { conj = {}; }
  conj.filled = true;
  let root = verb.substr(0, verb.length - 2);
  let type = verb.substr(verb.length - 2);
  let reflexive = type == 'se';
  if (reflexive) {
    type = root.substr(root.length - 2);
    root = root.substr(0, root.length - 2);
  }
  let tenses = CONJES[type];
  if (!tenses) { return conj; }
  for (let tense of Object.keys(tenses)) {
    if (conj[tense] === null) {
      conj[tense] = DIOS_MIO;
    } else {
      let alt_root = conj[tense + '_root'] || root;
      let transform = conj[tense + '_root_transform'];
      let roots = (transform ? TRANSFORMS[transform] : TRANSFORMS.none)(alt_root);
      let conjugations = append(roots, CONJES[type][tense], reflexive);
      if (!conj[tense]) { conj[tense] = Array(6).fill(null); }
      conj[tense] = conjugations.map((c, i) => conj[tense][i] || c);
      if (tense.includes('continuous') && conj.continuous_form) {
        conj[tense] = conj[tense].map(c => c.split(' ')[0] + ' ' + conj.continuous_form);
      }
    } 
  }
  return conj;
};

const select_random = s => {
  let arr = Array.from($$('input[name="' + s + '"]'));
  arr[Math.floor(Math.random() * arr.length)].checked = true;
};

const loaded = data => {
  window.conjugations = data;
  let current_word;
  let update = () => {
    if (!data[current_word].filled) {
      data[current_word] = fill(current_word, data[current_word]);
    }
    let person = $('input[name="person"]:checked').value;
    let plurality = $('input[name="plurality"]:checked').value;
    let idx = +person + (plurality == 'singular' ? 0 : 3);
    let tense = $('input[name="tense"]:checked').value;
    let conjugated = data[current_word][tense][idx];
    let translated = data[current_word].english;
    $('#conjugation').innerText = conjugated;
    $('#translation').innerText = translated;
    $('#infinitive').innerText = current_word;
  };
  window.set_word = (w) => {
    current_word = w;
    update();
  }
  let words = Object.keys(data);
  let randomise = () => {
    let idx = Math.floor(Math.random() * words.length);
    current_word = words[idx];
    select_random('person');
    select_random('plurality');
    select_random('tense');
    update();
  };
  $('.output').addEventListener('click', randomise);
  Array.from(document.querySelectorAll('input')).forEach(input =>
    input.addEventListener('change', update));
  randomise();
};

window.addEventListener('load', () => {
  fetch("conjugations.json", {cache: "force-cache"}).then(r => r.json()).then(loaded);
});
