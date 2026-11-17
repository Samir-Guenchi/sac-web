/**
 * ZAPHIRA: Journal stories (shown on /journal and /journal/[id]).
 * Text fields are localized { en, fr, ar }. Bodies use the RichText format:
 * paragraphs separated by a blank line, "## " for a subtitle, "- " for a list item.
 * Photos are the house's own; the admin can add more in Admin → Journal & testimonials.
 */

const img = (path: string) => `assets/images/${path}`;

/** Titles of the first mock-up's entries: replaced on the next seed. */
export const LEGACY_JOURNAL_TITLES = ['The Selection of Freshwater Baroque Pearls', 'The Art of Organza Hand-Pleating'];

export const JOURNAL_ENTRIES = [
  {
    tag: { en: 'Inspiration', fr: 'Inspiration', ar: 'إلهام' },
    title: {
      en: 'Picasso Blue: a colour that tells a story',
      fr: 'Bleu Picasso : une couleur qui raconte',
      ar: 'أزرق بيكاسو: لون يحكي قصة'
    },
    excerpt: {
      en: 'Why the house chose the deep blue of Picasso’s early years and of the Mediterranean as its signature.',
      fr: 'Pourquoi la maison a choisi le bleu profond des premières années de Picasso et de la Méditerranée comme signature.',
      ar: 'لماذا اختارت الدار الأزرق العميق لسنوات بيكاسو الأولى وللبحر المتوسط توقيعاً لها.'
    },
    body: {
      en: 'Some colours are worn; others are lived. Picasso’s blue was his way of painting tenderness and melancholy at once, and it is the colour of the sea that runs along the whole Algerian coast, from El Kala to Ghazaouet.\n\n## A signature, not a trend\n\nAt Zaphira, blue is the thread that ties everything together: our boxes, our cards, the ribbon of our bags, and some of our most loved creations, like Nuit Bleue or Perle d’Azur.\n\n## How to wear it\n\n- With white linen and gold jewellery, for a Mediterranean summer.\n- With camel and cream, for an elegant winter.\n- With nothing else: a blue bag is a statement on its own.',
      fr: 'Il y a des couleurs que l’on porte, et d’autres que l’on vit. Le bleu de Picasso était sa façon de peindre à la fois la tendresse et la mélancolie, et c’est la couleur de la mer qui longe toute la côte algérienne, d’El Kala à Ghazaouet.\n\n## Une signature, pas une tendance\n\nChez Zaphira, le bleu est le fil qui relie tout : nos coffrets, nos cartes, le ruban de nos sacs, et certaines de nos créations les plus aimées, comme Nuit Bleue ou Perle d’Azur.\n\n## Comment le porter\n\n- Avec du lin blanc et des bijoux dorés, pour un été méditerranéen.\n- Avec du camel et du crème, pour un hiver élégant.\n- Seul : un sac bleu est une déclaration à lui tout seul.',
      ar: 'هناك ألوان نرتديها، وألوان نعيشها. كان أزرق بيكاسو طريقته في رسم الحنان والحنين معاً، وهو لون البحر الذي يمتدّ على طول الساحل الجزائري، من القالة إلى الغزوات.\n\n## توقيع لا موضة عابرة\n\nفي زفيرة، الأزرق هو الخيط الذي يربط كل شيء: علبنا وبطاقاتنا وشريط حقائبنا، وبعض أحبّ تصاميمنا مثل «نوي بلو» و«بيرل دازور».\n\n## كيف ترتدينه\n\n- مع الكتان الأبيض والمجوهرات الذهبية، لصيف متوسطي.\n- مع الجملي والكريمي، لشتاء أنيق.\n- وحده: الحقيبة الزرقاء تتحدث عن نفسها.'
    },
    image: img('products/hiver/nuit-bleue-1.jpg'),
    gallery: [img('products/ceremonie/perle-dazur-1.jpg'), img('products/hiver/ondine-1.jpg'), img('branding/ecrin-zaphira.svg')],
    readTime: { en: '3 min read', fr: '3 min de lecture', ar: 'قراءة 3 دقائق' },
    date: { en: 'November 2026', fr: 'Novembre 2026', ar: 'نوفمبر 2026' }
  },
  {
    tag: { en: 'Savoir-faire', fr: 'Savoir-faire', ar: 'حِرفة' },
    title: {
      en: 'Thirty hours, one bag: inside the atelier',
      fr: 'Trente heures, un sac : dans l’atelier',
      ar: 'ثلاثون ساعة، حقيبة واحدة: داخل الورشة'
    },
    excerpt: {
      en: 'From the first loop to the gold clasp, follow the hands that crochet and weave every Zaphira bag.',
      fr: 'De la première maille au fermoir doré, suivez les mains qui crochètent et tissent chaque sac Zaphira.',
      ar: 'من الغرزة الأولى إلى القفل الذهبي، تابعي الأيادي التي تحيك وتنسج كل حقيبة زفيرة.'
    },
    body: {
      en: 'Every Zaphira bag starts with a sketch and a ball of yarn. Then come the hours: counting stitches, tightening the weave, checking the shape against the template again and again.\n\n## The stitch\n\nWoven basket stitch, velvet chenille, bouclé, damier or chevron: each stitch has its own rhythm. A damier bag is built square by square; a chevron one follows the wave of the pattern line after line.\n\n## The finishing\n\nThe lining is sewn by hand, the clasp is fixed, the chain or handle is attached. Only then is the bag inspected, wrapped and placed in its blue box.',
      fr: 'Chaque sac Zaphira commence par un croquis et une pelote. Puis viennent les heures : compter les mailles, resserrer le tissage, vérifier la forme sur le gabarit, encore et encore.\n\n## Le point\n\nPoint tressé, chenille velours, bouclette, damier ou chevron : chaque point a son rythme. Un sac damier se construit carré par carré ; un sac chevron suit la vague du motif, rang après rang.\n\n## La finition\n\nLa doublure est cousue à la main, le fermoir posé, la chaîne ou l’anse fixée. Alors seulement, le sac est contrôlé, emballé et déposé dans son coffret bleu.',
      ar: 'تبدأ كل حقيبة زفيرة برسم وكبة خيط. ثم تأتي الساعات: عدّ الغرز، وشدّ النسيج، ومطابقة الشكل مع القالب مرة بعد مرة.\n\n## الغرزة\n\nغرزة مضفورة، شنيل مخملي، فرو مجعّد، مربعات أو زخرفة متموّجة: لكل غرزة إيقاعها. حقيبة المربعات تُبنى مربعاً مربعاً، والمتموّجة تتبع الموجة صفاً بعد صف.\n\n## اللمسات الأخيرة\n\nتُخاط البطانة يدوياً، ويُثبَّت القفل والسلسلة أو المقبض. بعدها فقط تُفحص الحقيبة وتُغلَّف وتوضع في علبتها الزرقاء.'
    },
    image: img('products/hiver/damier-bordeaux-1.jpg'),
    gallery: [img('products/printemps/djurdjura-1.jpg'), img('products/hiver/cedre-1.jpg'), img('products/printemps/atlas-1.jpg'), img('editorial/craftsmanship-macro.jpg')],
    readTime: { en: '4 min read', fr: '4 min de lecture', ar: 'قراءة 4 دقائق' },
    date: { en: 'October 2026', fr: 'Octobre 2026', ar: 'أكتوبر 2026' }
  },
  {
    tag: { en: 'Style', fr: 'Style', ar: 'أناقة' },
    title: {
      en: 'Five ways to wear your bag this winter',
      fr: 'Cinq façons de porter votre sac cet hiver',
      ar: 'خمس طرق لحمل حقيبتكِ هذا الشتاء'
    },
    excerpt: {
      en: 'Bouclé with a long coat, chenille for the evening, damier with denim: our styling notes for the cold season.',
      fr: 'La bouclette avec un long manteau, la chenille pour le soir, le damier avec un jean : nos conseils de style pour la saison froide.',
      ar: 'الفرو المجعّد مع معطف طويل، والشنيل للسهرة، والمربعات مع الجينز: نصائحنا لموسم البرد.'
    },
    body: {
      en: 'Winter is the season of texture. Here is how our clients wear their Zaphira bags when the days get shorter.\n\n- Bouclé white (Flocon) with a camel coat and ankle boots.\n- Burgundy chenille (Impératrice) for dinners and family evenings.\n- Damier with straight jeans and a white shirt, for the weekend.\n- Emerald (Yakouren) with black: a jewel of colour on a dark outfit.\n- Red carmine on the shoulder, gold chain out: the evening classic.\n\n## Our tip\n\nChoose one textured piece per outfit. Let the bag be the jewel.',
      fr: 'L’hiver est la saison des matières. Voici comment nos clientes portent leur sac Zaphira quand les jours raccourcissent.\n\n- La bouclette blanche (Flocon) avec un manteau camel et des bottines.\n- La chenille bordeaux (Impératrice) pour les dîners et les soirées en famille.\n- Le damier avec un jean droit et une chemise blanche, pour le week-end.\n- L’émeraude (Yakouren) avec du noir : un bijou de couleur sur une tenue sombre.\n- Le rouge carmin à l’épaule, chaîne dorée sortie : le classique du soir.\n\n## Notre conseil\n\nUne seule pièce texturée par tenue. Laissez le sac être le bijou.',
      ar: 'الشتاء موسم الملمس. إليكِ كيف تحمل عميلاتنا حقائب زفيرة حين تقصر الأيام.\n\n- الفرو الأبيض (فلوكون) مع معطف جملي وحذاء قصير.\n- الشنيل العنابي (إمبيراتريس) للعشاء والسهرات العائلية.\n- المربعات مع جينز مستقيم وقميص أبيض، لعطلة نهاية الأسبوع.\n- الزمردي (ياكوران) مع الأسود: جوهرة لون على إطلالة داكنة.\n- الأحمر القرمزي على الكتف مع السلسلة الذهبية: كلاسيكية السهرة.\n\n## نصيحتنا\n\nقطعة واحدة بملمس مميّز في كل إطلالة. دعي الحقيبة تكون الجوهرة.'
    },
    image: img('products/hiver/flocon-1.jpg'),
    gallery: [img('products/luxe/imperatrice-1.jpg'), img('products/hiver/damier-noir-1.jpg'), img('products/hiver/yakouren-1.jpg'), img('products/hiver/carmin-1.jpg')],
    readTime: { en: '3 min read', fr: '3 min de lecture', ar: 'قراءة 3 دقائق' },
    date: { en: 'November 2026', fr: 'Novembre 2026', ar: 'نوفمبر 2026' }
  },
  {
    tag: { en: 'Algeria', fr: 'Algérie', ar: 'الجزائر' },
    title: {
      en: 'Bags named after the places we love',
      fr: 'Des sacs qui portent le nom des lieux que nous aimons',
      ar: 'حقائب تحمل أسماء أماكن نحبّها'
    },
    excerpt: {
      en: 'Tipaza, Djurdjura, Tassili, the Casbah: the story behind the names of our 2026 line.',
      fr: 'Tipaza, Djurdjura, Tassili, la Casbah : l’histoire derrière les noms de notre ligne 2026.',
      ar: 'تيبازة، جرجرة، الطاسيلي، القصبة: الحكاية وراء أسماء مجموعتنا لعام 2026.'
    },
    body: {
      en: 'Each bag of the 2026 line carries the name of a place that shaped us.\n\n## By the sea\n\nTipaza, with its ruins facing the waves, gave its name to our wave-patterned bag. Oasis and Sable Doré bring the warm tones of the south.\n\n## In the mountains\n\nDjurdjura and Yakouren tell of the Kabyle forests and their deep greens; Neige de Chréa, of the first snow above Blida.\n\n## In the city\n\nNuit de Casbah is the black of the old town’s alleys at night, lit by a striped silk scarf. Blanche d’Alger is the white city seen from the bay.',
      fr: 'Chaque sac de la ligne 2026 porte le nom d’un lieu qui nous a façonnées.\n\n## Au bord de la mer\n\nTipaza, ses ruines face aux vagues, a donné son nom à notre sac aux motifs de vagues. Oasis et Sable Doré apportent les tons chauds du Sud.\n\n## Dans les montagnes\n\nDjurdjura et Yakouren racontent les forêts de Kabylie et leurs verts profonds ; Neige de Chréa, la première neige au-dessus de Blida.\n\n## En ville\n\nNuit de Casbah, c’est le noir des ruelles de la vieille ville la nuit, éclairé d’un foulard rayé. Blanche d’Alger, c’est la ville blanche vue depuis la baie.',
      ar: 'تحمل كل حقيبة من مجموعة 2026 اسم مكان صنعنا.\n\n## على شاطئ البحر\n\nتيبازة، بآثارها المطلّة على الأمواج، منحت اسمها لحقيبتنا ذات زخارف الموج. وتحمل «أوازيس» و«سابل دوري» ألوان الجنوب الدافئة.\n\n## في الجبال\n\nجرجرة وياكوران تحكيان غابات القبائل وخضرتها العميقة، و«نيج دو شريعة» أول ثلج فوق البليدة.\n\n## في المدينة\n\n«نوي دو كازبا» هو سواد أزقة المدينة القديمة ليلاً، يضيئه وشاح مخطّط. و«بلانش دالجي» هي المدينة البيضاء كما تُرى من الخليج.'
    },
    image: img('products/printemps/tipaza-1.jpg'),
    gallery: [img('products/printemps/nuit-de-casbah-1.jpg'), img('products/printemps/djurdjura-1.jpg'), img('products/printemps/blanche-dalger-1.jpg'), img('products/printemps/oasis-1.jpg'), img('editorial/algeria-heritage.jpg')],
    readTime: { en: '5 min read', fr: '5 min de lecture', ar: 'قراءة 5 دقائق' },
    date: { en: 'September 2026', fr: 'Septembre 2026', ar: 'سبتمبر 2026' }
  },
  {
    tag: { en: 'Care', fr: 'Entretien', ar: 'العناية' },
    title: {
      en: 'Caring for a handmade bag',
      fr: 'Prendre soin d’un sac fait main',
      ar: 'العناية بحقيبة مصنوعة يدوياً'
    },
    excerpt: {
      en: 'Simple gestures to keep the shape, the colour and the softness of your Zaphira for years.',
      fr: 'Des gestes simples pour garder la forme, la couleur et la douceur de votre Zaphira pendant des années.',
      ar: 'خطوات بسيطة للحفاظ على شكل حقيبة زفيرة ولونها ونعومتها لسنوات.'
    },
    body: {
      en: 'A handmade bag lives with you. A few gestures keep it beautiful.\n\n- Store it stuffed with tissue paper, in its dust bag, away from the sun.\n- Never hang it by its chain for long: the stitches would stretch.\n- For a small stain, dab gently with a damp cloth and a drop of mild soap. Never machine wash.\n- Brush bouclé and chenille softly with your hand to bring back the pile.\n\n## A repair?\n\nWrite to us: the atelier that made your bag can mend it.',
      fr: 'Un sac fait main vit avec vous. Quelques gestes suffisent à le garder beau.\n\n- Rangez-le rembourré de papier de soie, dans sa housse, à l’abri du soleil.\n- Ne le suspendez jamais longtemps par sa chaîne : les mailles se détendraient.\n- Pour une petite tache, tamponnez doucement avec un linge humide et une goutte de savon doux. Jamais en machine.\n- Brossez la bouclette et la chenille du plat de la main pour leur redonner du gonflant.\n\n## Une réparation ?\n\nÉcrivez-nous : l’atelier qui a réalisé votre sac peut le réparer.',
      ar: 'الحقيبة المصنوعة يدوياً تعيش معكِ. بضع خطوات تكفي لتبقى جميلة.\n\n- احفظيها محشوّة بورق ناعم داخل كيسها، بعيداً عن الشمس.\n- لا تعلّقيها طويلاً من سلسلتها: فقد ترتخي الغرز.\n- للبقعة الصغيرة، امسحي بلطف بقطعة قماش مبلّلة وقطرة صابون لطيف. لا تغسليها في الغسالة.\n- مرّري يدكِ بلطف على الفرو والشنيل ليستعيدا انتفاخهما.\n\n## تحتاجين إصلاحاً؟\n\nراسلينا: الورشة التي صنعت حقيبتكِ تستطيع إصلاحها.'
    },
    image: img('products/printemps/sable-dore-1.jpg'),
    gallery: [img('products/printemps/constantine-1.jpg'), img('products/hiver/duo-bouclette-1.jpg')],
    readTime: { en: '2 min read', fr: '2 min de lecture', ar: 'قراءة دقيقتين' },
    date: { en: 'August 2026', fr: 'Août 2026', ar: 'أغسطس 2026' }
  }
];
