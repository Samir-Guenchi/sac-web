/**
 * Starting content for the information pages. Everything is editable in
 * Admin → Pages. Legal pages are templates: their final wording must come from
 * Maison Zaphira (ideally reviewed by a lawyer) before launch.
 */

type L = { fr: string; en: string; ar: string };
export type SeedPage = { slug: string; title: L; body: L };

const TODO = {
  fr: '[À compléter par Maison Zaphira avant la mise en ligne.]',
  en: '[To be completed by Maison Zaphira before launch.]',
  ar: '[يُستكمل من طرف دار زفيرة قبل الإطلاق.]'
};

export const PAGES: SeedPage[] = [
  {
    slug: 'livraison-retours',
    title: { fr: 'Livraison & retours', en: 'Delivery & returns', ar: 'التوصيل والإرجاع' },
    body: {
      fr: `## Livraison
La livraison est offerte dans les 69 wilayas d’Algérie. Chaque création est réalisée à la main sur commande dans notre atelier d’Alger : notre service client vous appelle pour confirmer votre commande et la date de livraison.

- Paiement à la livraison disponible partout en Algérie
- Livraison internationale sur demande

## Retours & échanges
Vous pouvez demander un retour ou un échange dans les 7 jours suivant la réception, pour toute pièce non portée et dans son emballage d’origine. Les créations sur-mesure (couleurs choisies, monogramme) ne sont ni reprises ni échangées.

Pour toute demande, contactez notre service client.`,
      en: `## Delivery
Delivery is free to all 69 wilayas of Algeria. Each creation is handmade to order in our Algiers atelier: our client service calls you to confirm your order and the delivery date.

- Cash on delivery available everywhere in Algeria
- International delivery on request

## Returns & exchanges
You may request a return or exchange within 7 days of receipt, for any unworn piece in its original packaging. Bespoke creations (chosen colours, monogram) cannot be returned or exchanged.

For any request, please contact our client service.`,
      ar: `## التوصيل
التوصيل مجاني إلى الولايات الـ69 في الجزائر. تُصنع كل قطعة يدوياً حسب الطلب في ورشتنا بالجزائر العاصمة، ويتصل بكِ فريق خدمة العملاء لتأكيد الطلب وموعد التسليم.

- الدفع عند الاستلام متاح في كل أنحاء الجزائر
- التوصيل الدولي عند الطلب

## الإرجاع والاستبدال
يمكنكِ طلب الإرجاع أو الاستبدال خلال 7 أيام من الاستلام لأي قطعة غير مستعملة وفي تغليفها الأصلي. لا تُرجع ولا تُستبدل التصاميم الخاصة (الألوان المختارة، الحروف المنقوشة).

لأي طلب، تواصلي مع خدمة العملاء.`
    }
  },
  {
    slug: 'faq',
    title: { fr: 'Questions fréquentes', en: 'Frequently asked questions', ar: 'الأسئلة الشائعة' },
    body: {
      fr: `## Combien de temps pour recevoir mon sac ?
Chaque sac est fait main sur commande. Notre service client vous indique le délai exact lors de l’appel de confirmation.

## Puis-je payer à la livraison ?
Oui, le paiement à la livraison est disponible dans les 69 wilayas.

## Puis-je personnaliser un modèle ?
Oui : choisissez couleur, matière, perles, chaîne et monogramme dans notre atelier sur-mesure, en page d’accueil.

## Comment suivre ma commande ?
Rendez-vous sur la page « Suivi de commande » avec votre numéro de commande et votre e-mail, ou connectez-vous à votre compte.`,
      en: `## How long until I receive my bag?
Each bag is handmade to order. Our client service gives you the exact lead time during the confirmation call.

## Can I pay on delivery?
Yes, cash on delivery is available in all 69 wilayas.

## Can I personalise a model?
Yes: choose colour, material, pearls, chain and monogram in our bespoke studio on the home page.

## How do I track my order?
Use the “Order tracking” page with your order number and email, or sign in to your account.`,
      ar: `## متى أستلم حقيبتي؟
تُصنع كل حقيبة يدوياً حسب الطلب، ويخبركِ فريق خدمة العملاء بالمدة الدقيقة عند مكالمة التأكيد.

## هل يمكنني الدفع عند الاستلام؟
نعم، الدفع عند الاستلام متاح في الولايات الـ69.

## هل يمكنني تخصيص تصميم؟
نعم: اختاري اللون والخامة واللؤلؤ والسلسلة والحروف في استوديو التصميم في الصفحة الرئيسية.

## كيف أتابع طلبي؟
من صفحة «تتبع الطلب» برقم الطلب وبريدكِ الإلكتروني، أو بتسجيل الدخول إلى حسابكِ.`
    }
  },
  {
    slug: 'entretien',
    title: { fr: 'Entretien de vos créations', en: 'Caring for your creations', ar: 'العناية بقطعكِ' },
    body: {
      fr: `Rangez votre sac dans sa housse, à l’abri de la lumière directe et de l’humidité.

- Velours et chenille : brossez délicatement dans le sens du poil
- Cordon tissé : essuyez avec un chiffon légèrement humide, sans frotter
- Perles et finitions dorées : évitez le contact avec le parfum et l’eau
- Ne surchargez pas votre sac afin de préserver sa forme`,
      en: `Store your bag in its dust bag, away from direct light and humidity.

- Velvet and chenille: brush gently in the direction of the pile
- Woven cord: wipe with a slightly damp cloth, without rubbing
- Pearls and gold-tone hardware: avoid contact with perfume and water
- Do not overfill your bag, to keep its shape`,
      ar: `احفظي حقيبتكِ في كيسها بعيداً عن الضوء المباشر والرطوبة.

- المخمل والشنيل: نظفيهما بفرشاة ناعمة في اتجاه الوبر
- الحبل المنسوج: امسحيه بقطعة قماش رطبة قليلاً دون فرك
- اللآلئ والإكسسوارات الذهبية: تجنبي ملامستها للعطر والماء
- لا تملئي الحقيبة أكثر من اللازم للحفاظ على شكلها`
    }
  },
  {
    slug: 'contact',
    title: { fr: 'Nous contacter', en: 'Contact us', ar: 'اتصلي بنا' },
    body: {
      fr: 'Nos conseillères vous répondent du samedi au jeudi, de 9h à 18h (heure d’Alger), par WhatsApp ou par téléphone.',
      en: 'Our advisors answer Saturday to Thursday, 9am to 6pm (Algiers time), by WhatsApp or phone.',
      ar: 'تجيبكِ مستشاراتنا من السبت إلى الخميس، من 9 صباحاً إلى 6 مساءً (بتوقيت الجزائر)، عبر واتساب أو الهاتف.'
    }
  },
  {
    slug: 'cgv',
    title: { fr: 'Conditions générales de vente', en: 'Terms and conditions of sale', ar: 'الشروط العامة للبيع' },
    body: {
      fr: `${TODO.fr}\n\n## Objet\n## Prix et paiement\n## Commande et confirmation\n## Livraison\n## Retours et rétractation\n## Garanties\n## Litiges`,
      en: `${TODO.en}\n\n## Purpose\n## Prices and payment\n## Order and confirmation\n## Delivery\n## Returns and withdrawal\n## Warranties\n## Disputes`,
      ar: `${TODO.ar}\n\n## الموضوع\n## الأسعار والدفع\n## الطلب والتأكيد\n## التوصيل\n## الإرجاع والعدول\n## الضمانات\n## النزاعات`
    }
  },
  {
    slug: 'confidentialite',
    title: { fr: 'Confidentialité & cookies', en: 'Privacy & cookies', ar: 'الخصوصية وملفات تعريف الارتباط' },
    body: {
      fr: `${TODO.fr}\n\n## Données collectées\nCommandes (nom, téléphone, adresse, e-mail), compte client, inscription à la newsletter.\n\n## Cookies\nLe site utilise uniquement des cookies nécessaires : session de connexion et langue choisie. Votre panier et votre devise sont conservés dans votre navigateur.\n\n## Vos droits\n## Contact`,
      en: `${TODO.en}\n\n## Data we collect\nOrders (name, phone, address, email), customer account, newsletter sign-up.\n\n## Cookies\nThe site only uses necessary cookies: sign-in session and chosen language. Your bag and currency are kept in your browser.\n\n## Your rights\n## Contact`,
      ar: `${TODO.ar}\n\n## البيانات المجمعة\nالطلبات (الاسم، الهاتف، العنوان، البريد الإلكتروني)، حساب العميلة، الاشتراك في النشرة.\n\n## ملفات تعريف الارتباط\nيستخدم الموقع فقط الملفات الضرورية: جلسة تسجيل الدخول واللغة المختارة. تُحفظ حقيبتكِ والعملة في متصفحكِ.\n\n## حقوقكِ\n## التواصل`
    }
  },
  {
    slug: 'mentions-legales',
    title: { fr: 'Mentions légales', en: 'Legal notice', ar: 'الإشعارات القانونية' },
    body: {
      fr: `${TODO.fr}\n\n## Éditeur du site\n## Registre de commerce\n## Hébergement\nVercel Inc.\n## Contact`,
      en: `${TODO.en}\n\n## Publisher\n## Trade register\n## Hosting\nVercel Inc.\n## Contact`,
      ar: `${TODO.ar}\n\n## ناشر الموقع\n## السجل التجاري\n## الاستضافة\nVercel Inc.\n## التواصل`
    }
  },
  {
    slug: 'accessibilite',
    title: { fr: 'Accessibilité', en: 'Accessibility', ar: 'إمكانية الوصول' },
    body: {
      fr: 'Nous voulons que chacune puisse découvrir et commander nos créations. Le site se parcourt au clavier, propose des textes alternatifs pour les images et existe en français, anglais et arabe. Si vous rencontrez une difficulté, contactez notre service client.',
      en: 'We want everyone to be able to discover and order our creations. The site can be used with a keyboard, provides text alternatives for images and is available in French, English and Arabic. If you encounter any difficulty, please contact our client service.',
      ar: 'نريد أن تتمكن كل واحدة من اكتشاف إبداعاتنا وطلبها. يمكن تصفح الموقع بلوحة المفاتيح، ويوفر نصوصاً بديلة للصور، وهو متاح بالفرنسية والإنجليزية والعربية. إن واجهتكِ أي صعوبة، تواصلي مع خدمة العملاء.'
    }
  }
];
