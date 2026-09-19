const emptyLocalized = () => ({ en: '', ar: '' });

export const DEFAULT_WHY_CHOOSE_SETTINGS = {
  title: {
    en: 'Why Choose Star Health',
    ar: 'لماذا تختار Star Health؟',
  },
  paragraph1: {
    en: 'Because at Star Health, you are not just a number in a booking system. You receive a human experience worthy of you and personalized care built around understanding your needs and creating a comprehensive care plan.',
    ar: 'لأنك في Star Health لست مجرد رقم في معادلة الحجوزات، بل تحظى بتجربة إنسانية تليق بك، وعناية خاصة تبدأ بفهم احتياجك وتُبنى على خطة متكاملة الأركان.',
  },
  paragraph2: {
    en: 'We treat you as we treat our own family. We choose for you only what we would accept for our loved ones—from the competence of our doctors and the quality of the materials, equipment and technologies used in our medical and aesthetic services to the follow-up we provide after the procedure.',
    ar: 'لذلك نختار لك إلا ما نرضاه لأهلنا؛ بدءًا من كفاءة أطبائنا، مرورًا بجودة المواد والأجهزة والتقنيات المستخدمة في خدماتنا العلاجية والتجميلية، وصولًا إلى المتابعة التي نحرص عليها بعد إتمام الإجراء.',
  },
  paragraph3: {
    en: 'Because every detail of your journey matters to us.',
    ar: 'لأن كل تفصيلة في رحلتك تهمّنا.',
  },
  counters: [
    {
      id: 'clients',
      value: 63,
      prefix: '+',
      suffix: 'K',
      decimals: 0,
      label: {
        en: 'Number of clients served',
        ar: 'عدد العملاء',
      },
      iconUrl: '',
    },
    {
      id: 'satisfaction',
      value: 92.5,
      prefix: '',
      suffix: '%',
      decimals: 1,
      label: {
        en: 'Customer satisfaction rate',
        ar: 'نسبة الرضا عن الخدمة',
      },
      iconUrl: '',
    },
  ],
  bookNowLabel: {
    en: 'Book Now',
    ar: 'احجز الآن',
  },
  whatsappLabel: {
    en: 'WhatsApp',
    ar: 'واتساب',
  },
  whatsappNumber: '966505730003',
  whatsappMessage: {
    en: 'Hello Star Health, I would like to know more.',
    ar: 'مرحباً ستار هيلث، أود الاستفسار.',
  },
};

export { emptyLocalized };
