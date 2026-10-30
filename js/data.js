/* =========================================================
   Speakout 3rd Edition B1+ — Data (units map)
   Page ranges refer to PDF pages of assets/pdf/student-book.pdf
   (printed page N = PDF page N-1, verified against the file)
   ========================================================= */
window.SODATA = {
  pdfs: {
    book: 'assets/pdf/student-book.pdf',
    audioscripts: 'assets/pdf/audioscripts.pdf',
    videoscripts: 'assets/pdf/videoscripts.pdf'
  },
  contents: { pages: [1, 5], title: 'المحتويات | Contents' },
  backmatter: [
    { id: 'gb', title: 'Grammar Bank', ar: 'بنك القواعد', pages: [103, 130], icon: 'grid' },
    { id: 'vb', title: 'Vocabulary Bank', ar: 'بنك المفردات', pages: [131, 136], icon: 'layers',
      note: 'المفردات المترتبة على وحدات الكتاب — النسخة هنا مقصوصة عند صفحة 136 (منتهي عند وحدة 6 تقريبًا).' }
  ],
  units: [
    {
      num: 1, title: 'me & mine', ar: 'أنا وممتلكاتي',
      color: ['#ff5e5b', '#ffb23f'],
      vlog: "What's the best present you've ever received?",
      opener: 6,
      objectives: ['كلام عن المقتنيات وخصائصها', 'حكايتك أنا في 3 أغراض', 'رسائل الهاتف الصوتية', 'ملحق تعليق على منتدى'],
      lessons: {
        '1A': { title: 'The story of me', ar: 'حكايتي أنا', pages: [7, 9],
          grammar: 'Narrative tenses', vocab: 'Describing possessions; materials', pron: 'Auxiliary verbs: weak forms',
          extras: ['بودكاست عن ممتلكات الناس', 'اكتب إعلانًا لبيع غرض أونلاين'] },
        '1B': { title: 'Less is more?', ar: 'الأقل أفضل؟', pages: [10, 12],
          grammar: 'Verb patterns', vocab: 'Personal preferences', pron: 'Stress in prepositional phrases',
          extras: ['مقال: مينيمالزم فيرصس ماكسمالزم', 'استبيان تفضيلات'] },
        '1C': { title: "Don't forget to …", ar: 'لا تنسَ أن…', pages: [13, 14],
          grammar: 'How to … leave phone messages', vocab: 'Phrasal verbs: housework', pron: 'Intonation in polite requests',
          extras: ['اتصالات هاتفية', 'الوساطة: تصميم بريد صوتي مفيد'] },
        '1D': { title: 'Your gadgets', ar: 'أجهزتك', pages: [15, 16],
          grammar: 'except for, apart from, (not) even', extras: ['BBC Street Interviews: الجمانج وسكرين تايم', 'كومنت على منتدى'] },
        'RR': { title: 'Unit Review', ar: 'مراجعة الوحدة', pages: [17, 17] }
      }
    },
    {
      num: 2, title: 'behaviour', ar: 'السلوك والعادات',
      color: ['#10b981', '#0ea5e9'],
      vlog: 'What good habits do you have?',
      opener: 18,
      objectives: ['مقال: كم تعرف عن تغيير العادات', 'الاستماع: أنت "People pleaser"؟', 'كلام عن المزعجات', 'برنامج BBC: Planet Earth II'],
      lessons: {
        '2A': { title: 'Change of habit', ar: 'تغيير العادات', pages: [19, 21],
          grammar: 'Present perfect continuous', vocab: 'Making changes', pron: 'Weak form of been',
          extras: ['مقال: إزاي تغير عادة', 'مهارات المستقبل: التفكير النقدي'] },
        '2B': { title: 'People pleaser', ar: 'مُرضي كل الناس', pages: [22, 24],
          grammar: 'Relative clauses', vocab: 'Collocations: feelings and behaviour', pron: 'Chunking in relative clauses',
          extras: ['ليستنينج: حول كونك people pleaser', 'ايميل اعتذار عن دعوة'] },
        '2C': { title: "That's annoying!", ar: 'هذا مزعج!', pages: [25, 26],
          grammar: 'How to … talk about things that annoy you', vocab: 'Pet hates', pron: 'Stress and intonation to show annoyance' },
        '2D': { title: 'BBC Programme: Planet Earth II: Jungles', ar: 'برنامج BBC: Planet Earth II: الأدغال', pages: [27, 28],
          video: 'prog', extras: ['برنامج وثائقي BBC', 'اكتب عن تجربة شخصية'] },
        'RR': { title: 'Unit Review', ar: 'مراجعة الوحدة', pages: [29, 29] }
      }
    },
    {
      num: 3, title: 'working life', ar: 'حياة العمل',
      color: ['#6366f1', '#8b5cf6'],
      vlog: 'Where do you prefer to work or study?',
      opener: 30,
      objectives: ['العمل موسوم', 'العمل الحر الصغير (Gig work)', 'واجهة مقابلة العمل', 'حوار BBC في الشوارع'],
      lessons: {
        '3A': { title: 'Working from home', ar: 'العمل من المنزل', pages: [31, 33],
          grammar: 'Conditional structures: unless, even if, in case (of)', vocab: 'Work phrases', pron: 'Stress in phrases',
          extras: ['مقال: مؤلفين عملوا من المنزل'] },
        '3B': { title: 'Gig work', ar: 'العمل الحر الصغير (Gig)', pages: [34, 36],
          grammar: 'Necessity, obligation and permission', vocab: 'Work', pron: 'Elision of /t/',
          extras: ['ليستنينج: المجتمع الجَيغ', 'ايميل تغطية (cover) لوظيفة'] },
        '3C': { title: 'Good question', ar: 'سؤال جيد', pages: [37, 38],
          grammar: 'How to … take part in an interview', vocab: 'Personality adjectives (1); negative prefixes', pron: 'Word stress in personality adjectives',
          extras: ['مهارات المستقبل: مقابلات العمل', 'وساطة: اختيار مرشح لوظيفة'] },
        '3D': { title: 'This or that?', ar: 'ده ولا ده؟', pages: [39, 40],
          grammar: 'Expressing preferences', video: 'street', extras: ['BBC Street Interviews: أفضلية الوظايف', 'منشور على لوحة مناقشة'] },
        'RR': { title: 'Unit Review', ar: 'مراجعة الوحدة', pages: [41, 41] }
      }
    },
    {
      num: 4, title: 'fact or fiction?', ar: 'حقيقة أم خيال؟',
      color: ['#8b5cf6', '#ec4899'],
      vlog: 'Do you prefer true stories or fiction?',
      opener: 42,
      objectives: ['حكاية خدعة (hoax)', 'سؤال غير مباشر', 'حديث الأخبار', 'برنامج BBC: Ordinary Lies'],
      lessons: {
        '4A': { title: 'Hoax!', ar: 'خدعة!', pages: [43, 45],
          grammar: 'Past plans and intentions', vocab: 'Truth and lies', pron: 'Silent consonants',
          extras: ['مقال عن خدعة مشهورة', 'إعادة سرد الحكاية'] },
        '4B': { title: 'Documentary', ar: 'الوثائقي', pages: [46, 48],
          grammar: 'Indirect and negative questions', vocab: 'Adjectives to describe films; films and film-making', pron: 'Intonation in indirect and negative questions',
          extras: ['ليستنينج: أفلام وثائقية مفضلة', 'اكتب ريفيو', 'وساطة: تلخيص مقابلات'] },
        '4C': { title: 'News', ar: 'الأخبار', pages: [49, 50],
          grammar: 'How to … talk about the news', vocab: 'News headlines; the news', pron: 'Word stress in adverbs for summarising' },
        '4D': { title: 'BBC: Ordinary Lies — Fake friends', ar: 'برنامج BBC: أصدقاء مزيّفون', pages: [51, 52],
          video: 'prog', extras: ['برنامج BBC Entertainment', 'احفظ ايميل/رسالة شخصية'] },
        'RR': { title: 'Unit Review', ar: 'مراجعة الوحدة', pages: [53, 53] }
      }
    },
    {
      num: 5, title: 'consumer', ar: 'المستهلك',
      color: ['#ec4899', '#f59e0b'],
      vlog: 'When was the last time you had a problem with a product or service?',
      opener: 54,
      objectives: ['الشكاوى والصوتية', 'الاعلانات وحيل السوق', 'ملخص من مصادر مختلفة', 'DIY مع استخدامات الحرف'],
      lessons: {
        '5A': { title: 'The customer is always right?', ar: 'العميل دائمًا على حق؟', pages: [55, 57],
          grammar: 'Clauses of purpose: to, so as to, in order to/that, so that', vocab: 'Personality adjectives (2)', pron: 'Word stress in adjectives',
          extras: ['ليستنينج: شكاوى', 'اكتب ايميل شكوى', 'وساطة: اشرح منتج'] },
        '5B': { title: 'Too good to be true', ar: 'جم جدًا على أن يصدق', pages: [58, 60],
          grammar: 'Comparative and superlative structures', vocab: 'Advertising; money', pron: 'Linking r in phrases',
          extras: ['مقال: حيل السوق', 'مناقشة كامباين تسويقي'] },
        '5C': { title: 'Which should I buy?', ar: 'أيهما أشتري؟', pages: [61, 62],
          grammar: 'How to … summarise information from different sources', vocab: 'Describing products', pron: 'Intonation in summarising phrases' },
        '5D': { title: 'I do it myself', ar: 'أعمله بنفسي (DIY)', pages: [63, 64],
          grammar: 'Causative have and get; reflexive pronouns', video: 'street', extras: ['BBC Street Interviews: أشياء يعملوها بأنفسهم', 'اكتب ملخص اجتماع'] },
        'RR': { title: 'Unit Review', ar: 'مراجعة الوحدة', pages: [65, 65] }
      }
    },
    {
      num: 6, title: 'places', ar: 'المدن والأماكن',
      color: ['#06b6d4', '#3b82f6'],
      vlog: "What's your favourite city?",
      opener: 66,
      objectives: ['وصف مناطق المدينة بـ so/such', 'رحلات ملحمية بـ be/get used to', 'طلب معلومات المواصلات', 'BBC Documentary: Reggie in China'],
      lessons: {
        '6A': { title: 'In the city', ar: 'في المدينة', pages: [67, 69],
          grammar: 'so and such', vocab: 'Areas of a city', pron: 'Intonation for emphasis with so and such',
          extras: ['ليستنينج: أسئلة عن أحيائكم المفضلة', 'اكتب طرق الوصول لمكان'] },
        '6B': { title: 'Great journeys', ar: 'رحلات مفعومة', pages: [70, 72],
          grammar: 'be/get used to', vocab: 'Challenges; idioms', pron: 'be/get used to',
          extras: ['مقال: رحلات ملحمية', 'وصف تجربة صعبة'] },
        '6C': { title: 'City transport', ar: 'مواصلات المدينة', pages: [73, 74],
          grammar: 'How to … ask for and confirm information', vocab: 'City transport', pron: 'Fast speech: just' },
        '6D': { title: 'BBC Documentary: Reggie in China', ar: 'BBC: Reggie في الصين', pages: [75, 76],
          video: 'prog', extras: ['برنامج وثائقي BBC', 'وصف فكرة مشروع', 'وساطة: مناقشة مقترح'] },
        'RR': { title: 'Unit Review', ar: 'مراجعة الوحدة', pages: [77, 77] }
      }
    },
    {
      num: 7, title: 'connect', ar: 'التواصل',
      color: ['#3b82f6', '#06b6d4'],
      vlog: "What's your favourite word?",
      opener: 78,
      objectives: ['الخطأ المكسوق (reported)', 'Passives + كومبيوتر', 'صيانة المحادثة', 'BBC Street Interviews: Communication'],
      lessons: {
        '7A': { title: 'Mix-up', ar: 'لخبطة/سوء فهم', pages: [79, 81],
          grammar: 'Reported speech', vocab: 'Reporting verbs; ways of speaking', pron: 'Stress in reporting verbs',
          extras: ['بودكاست سوء فهم', 'قصة حدث يوم ما'] },
        '7B': { title: 'Oversharing', ar: 'المشاركة المفرطة', pages: [82, 84],
          grammar: 'Passives', vocab: 'Computer use; internet words', pron: 'Stress and weak forms in passives',
          extras: ['مقال: مشاركة مفرطة أونلاين', 'مهارات: التفكير النقدي'] },
        '7C': { title: 'Conversation savers', ar: 'منقذ المحادثة', pages: [85, 86],
          grammar: 'How to … keep a conversation going', vocab: 'Adverbs', pron: 'Intonation in short questions' },
        '7D': { title: 'A good communicator', ar: 'متواصل جيد', pages: [87, 88],
          grammar: 'Avoiding repetition: so, to, not, be', video: 'street', extras: ['اختصار الكلام المتكرر', 'اكتب ايميل نصيحة لمشكلة'] },
        'RR': { title: 'Unit Review', ar: 'مراجعة الوحدة', pages: [89, 89] }
      }
    },
    {
      num: 8, title: 'wisdom', ar: 'الحكمة والنصائح',
      color: ['#f59e0b', '#84cc16'],
      vlog: "What's the best piece of advice you've ever been given?",
      opener: 90,
      objectives: ['Third conditional + should have', 'would + دروس الحياة', 'كيف أعطي برزنتيشن', 'برنامج BBC: Dragons’ Den'],
      lessons: {
        '8A': { title: 'Wise words', ar: 'كلمات حكيمة', pages: [91, 93],
          grammar: 'Third conditional and should have', vocab: 'Phrases of advice', pron: 'Contractions in complex sentences',
          extras: ['مقال: نصائح من أعمار مختلفة', 'مهارات: التفكير النقدي'] },
        '8B': { title: 'Life lessons', ar: 'دروس الحياة', pages: [94, 96],
          grammar: 'would', vocab: 'Learning; phrasal verbs', pron: 'Contracted would',
          extras: ['BBC Radio: أصل شغف رجل بالفضول', 'اكتب سيرة قصيرة'] },
        '8C': { title: 'One thing I know…', ar: 'ما أعرفه متيقنًا…', pages: [97, 98],
          grammar: 'How to … give a presentation', vocab: 'Presenting', pron: 'Stressing words in key phrases' },
        '8D': { title: "BBC Dragons' Den", ar: 'برنامج BBC: Dragons’ Den', pages: [99, 100],
          video: 'prog', extras: ['Pitch فكرة تجارية', 'اكتب ايميل خبر شغل', 'وساطة: أسئلة استنارة'] },
        'RR': { title: 'Unit Review', ar: 'مراجعة الوحدة', pages: [101, 101] }
      }
    }
  ],
  videos: {
    vlogs: { ar: 'BBC Vlog — سؤال الوحدة' },
    street: { ar: 'BBC Street Interviews — مقابلات الشارع' },
    prog: { ar: 'BBC Programme — برنامج الوحدة' }
  }
};
