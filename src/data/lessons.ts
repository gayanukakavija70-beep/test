import { BiologyLesson } from '../types';

export const BIOLOGY_LESSONS: BiologyLesson[] = [
  {
    id: 1,
    number: 1,
    title: 'ජීව විද්යාව හැඳින්වීම',
    englishTitle: 'Introduction to Biology',
    iconName: 'Microscope',
    description: 'ජීවයේ ස්වභාවය, ලක්ෂණ හා ජීව විද්‍යාත්මක ක්‍රමවේදය',
  },
  {
    id: 2,
    number: 2,
    title: 'ජීවයේ රසායනික හා සෛලීය පදනම',
    englishTitle: 'Chemical and Cellular Basis of Life',
    iconName: 'Dna',
    description: 'ජෛව අණු, සෛල ව්‍යුහය හා සෛලීය ක්‍රියාවලි',
  },
  {
    id: 3,
    number: 3,
    title: 'පරිණාමය හා ජීවීන්ගේ විවිධත්වය',
    englishTitle: 'Evolution and Diversity of Organisms',
    iconName: 'GitBranch',
    description: 'පරිණාමික න්‍යාය, රාජධානි හා ජීවී විවිධත්වය',
  },
  {
    id: 4,
    number: 4,
    title: 'ශාක ආකාරය හා ක්රියාකාරිත්වය',
    englishTitle: 'Plant Form and Function',
    iconName: 'Sprout',
    description: 'ශාක පටක, ප්‍රභාසංශ්ලේෂණය හා පරිවහනය',
  },
  {
    id: 5,
    number: 5,
    title: 'සත්ව ආකාරය හා ක්රියාකාරිත්වය',
    englishTitle: 'Animal Form and Function',
    iconName: 'HeartPulse',
    description: 'මිනිස් දේහ පද්ධති, ජීර්ණය, රුධිර සංසරණය හා ස්නායු පද්ධතිය',
  },
  {
    id: 6,
    number: 6,
    title: 'ප්රවේණිය',
    englishTitle: 'Genetics',
    iconName: 'Share2',
    description: 'මෙන්ඩලීය ප්‍රවේණිය, සම්භාවිතාව හා ප්‍රවේණික අසාමාන්‍යතා',
  },
  {
    id: 7,
    number: 7,
    title: 'අණුක ජීව විද්යාව',
    englishTitle: 'Molecular Biology',
    iconName: 'Binary',
    description: 'DNA ප්‍රතිවලිතය, පිටපත් කිරීම, පරිවර්තනය හා ජාන තාක්ෂණය',
  },
  {
    id: 8,
    number: 8,
    title: 'පාරිසරික ජීව විද්යාව',
    englishTitle: 'Environmental Biology',
    iconName: 'Trees',
    description: 'පරිසර පද්ධති, ජෛව භූ රසායනික චක්‍ර හා ජෛව විවිධත්ව සංරක්ෂණය',
  },
  {
    id: 9,
    number: 9,
    title: 'ක්ෂුද්ර ජීව විද්යාව',
    englishTitle: 'Microbiology',
    iconName: 'Bug',
    description: 'බැක්ටීරියා, වෛරස, දිලීර හා ක්ෂුද්‍රජීවී ක්‍රියාකාරීත්වය',
  },
  {
    id: 10,
    number: 10,
    title: 'ව්යවහාරික ජීව විද්යාව',
    englishTitle: 'Applied Biology',
    iconName: 'FlaskConical',
    description: 'කෘෂිකාර්මික, වෛද්‍ය හා කාර්මික ජීව විද්‍යා යෙදුම්',
  },
];

export const STARTER_SEED_FOLDERS = [
  {
    lessonId: 1,
    name: 'ජීවයේ මූලික ලක්ෂණ (Key Characteristics)',
    cards: [
      {
        question: 'ජීවීන් සතු ප්‍රධාන මූලික ලක්ෂණ 7 මොනවාද?',
        answer: '1. සංවිධානය 2. පරිවෘත්තිය 3. වර්ධනය හා විකසනය 4. උද්දීප්‍යතාව හා සමායෝජනය 5. අනුවර්තනය 6. ප්‍රජනනය 7. ආවේණිය',
      },
      {
        question: 'පරිවෘත්තිය (Metabolism) යනු කුමක්ද?',
        answer: 'ජීවියෙකු තුළ සිදුවන සියලුම ජෛව රසායනික ප්‍රතික්‍රියාවල සමස්ත එකතුවයි. (උපචය + අපචය)',
      },
      {
        question: 'ජීවයේ ධුරාවලි මට්ටම් පිළිවෙළින් දක්වන්න.',
        answer: 'අණු -> සෛල ඉන්ද්‍රයිකා -> සෛල -> පටක -> අවයව -> අවයව පද්ධති -> ජීවියා -> ගහනය -> ප්‍රජාව -> පරිසර පද්ධතිය -> ජෛව ගෝලය',
      },
    ],
  },
  {
    lessonId: 2,
    name: 'සෛල ඉන්ද්‍රයිකා (Cell Organelles)',
    cards: [
      {
        question: 'සෛලයේ "ශක්ති බලාගාරය" (Powerhouse of the cell) ලෙස හඳුන්වන්නේ කුමක්ද?',
        answer: 'මයිටොකොන්ඩ්‍රියා (Mitochondria) - ATP නිපදවන ප්‍රධාන ස්ථානයයි.',
      },
      {
        question: 'ප්‍රෝටීන සංස්ලේෂණය සිදුකරන සෛල ඉන්ද්‍රයිකාව කුමක්ද?',
        answer: 'රයිබොසෝම (Ribosomes) - රළු අන්තඃප්ලාස්මීය ජාලය මත හෝ සෛල ප්ලාස්මයේ නිදහස්ව පිහිටයි.',
      },
      {
        question: 'ශාක සෛලවල පමණක් ඇති සුවිශේෂී ව්‍යුහ 3ක් නම් කරන්න.',
        answer: '1. සෙලියුලෝස් සෛල බිත්තිය 2. හරිතලව (Chloroplasts) 3. විශාල මධ්‍ය රික්තකය',
      },
    ],
  },
];
