import appointment_img from './appointment_img.png'
import header_img from './header_img.png'
import group_profiles from './group_profiles.png'
import profile_pic from './profile_pic.png'
import contact_image from './contact_image.png'
import about_image from './about_image.png'
import logo from './logo.jpg'
import dropdown_icon from './dropdown_icon.svg'
import menu_icon from './menu_icon.svg'
import cross_icon from './cross_icon.png'
import chats_icon from './chats_icon.svg'
import verified_icon from './verified_icon.svg'
import arrow_icon from './arrow_icon.svg'
import info_icon from './info_icon.svg'
import upload_icon from './upload_icon.png'
import stripe_logo from './stripe_logo.png'
import razorpay_logo from './razorpay_logo.png'
import doc1 from './doc1.png'
import doc2 from './doc2.png'
import doc3 from './doc3.png'
import doc4 from './doc4.png'
import doc5 from './doc5.png'
import doc6 from './doc6.png'
import doc7 from './doc7.png'
import doc8 from './doc8.png'
import doc9 from './doc9.png'
import doc10 from './doc10.png'
import doc11 from './doc11.png'
import doc12 from './doc12.png'
import doc13 from './doc13.png'
import doc14 from './doc14.png'
import doc15 from './doc15.png'
import spec_hairdresser from './spec_hairdresser.png'
import spec_manicure from './spec_manicure.png'
import spec_pedicure from './spec_pedicure.png'
import spec_makeup from './spec_makeup.png'
import spec_brow from './spec_brow.png'
import spec_cosmetology from './spec_cosmetology.png'


export const assets = {
    appointment_img,
    header_img,
    group_profiles,
    logo,
    chats_icon,
    verified_icon,
    info_icon,
    profile_pic,
    arrow_icon,
    contact_image,
    about_image,
    menu_icon,
    cross_icon,
    dropdown_icon,
    upload_icon,
    stripe_logo,
    razorpay_logo
}

export const specialityData = [
    {
        speciality: 'Парикмахер',
        image: spec_hairdresser
    },
    {
        speciality: 'Мастер маникюра',
        image: spec_manicure
    },
    {
        speciality: 'Мастер педикюра',
        image: spec_pedicure
    },
    {
        speciality: 'Визажист',
        image: spec_makeup
    },
    {
        speciality: 'Бровист',
        image: spec_brow
    },
    {
        speciality: 'Косметолог',
        image: spec_cosmetology
    },
]

export const doctors = [
    {
        _id: 'doc1',
        name: 'Анна Соколова',
        image: doc1,
        speciality: 'Парикмахер',
        degree: 'Сертификат L\'Oreal',
        experience: '4 года',
        about: 'Анна — профессиональный парикмахер с многолетним опытом. Специализируется на окрашивании, стрижках и уходе за волосами. Использует только проверенные профессиональные средства и следит за актуальными трендами.',
        fees: 1500,
        address: {
            line1: 'ул. Пушкина, д. 10',
            line2: 'Салон красоты «Glamour», каб. 2'
        }
    },
    {
        _id: 'doc2',
        name: 'Мария Иванова',
        image: doc2,
        speciality: 'Мастер маникюра',
        degree: 'Сертификат CND',
        experience: '3 года',
        about: 'Мария — мастер маникюра и педикюра с художественным образованием. Создаёт уникальные дизайны, выполняет наращивание и укрепление ногтей. Работает с гель-лаками и акрилом.',
        fees: 900,
        address: {
            line1: 'ул. Ленина, д. 5',
            line2: 'Салон красоты «Glamour», каб. 3'
        }
    },
    {
        _id: 'doc3',
        name: 'Екатерина Петрова',
        image: doc3,
        speciality: 'Мастер педикюра',
        degree: 'Сертификат OPI',
        experience: '1 год',
        about: 'Екатерина специализируется на аппаратном и классическом педикюре. Выполняет SPA-педикюр, обработку стоп и ногтей, а также художественный дизайн. Внимательна к деталям.',
        fees: 800,
        address: {
            line1: 'ул. Садовая, д. 12',
            line2: 'Салон красоты «Glamour», каб. 4'
        }
    },
    {
        _id: 'doc4',
        name: 'Ольга Кузнецова',
        image: doc4,
        speciality: 'Визажист',
        degree: 'Диплом Make-Up Forever',
        experience: '2 года',
        about: 'Ольга — профессиональный визажист, работающий в сфере свадебного, вечернего и повседневного макияжа. Имеет опыт работы на фотосессиях и показах мод.',
        fees: 1200,
        address: {
            line1: 'ул. Цветочная, д. 8',
            line2: 'Салон красоты «Glamour», каб. 1'
        }
    },
    {
        _id: 'doc5',
        name: 'Наталья Смирнова',
        image: doc5,
        speciality: 'Бровист',
        degree: 'Сертификат Billion Dollar Brows',
        experience: '4 года',
        about: 'Наталья — мастер по оформлению бровей и ресниц. Выполняет коррекцию, архитектуру бровей, окрашивание хной и ламинирование. Работает с любым типом бровей.',
        fees: 700,
        address: {
            line1: 'ул. Морская, д. 3',
            line2: 'Салон красоты «Glamour», каб. 5'
        }
    },
    {
        _id: 'doc6',
        name: 'Дарья Новикова',
        image: doc6,
        speciality: 'Бровист',
        degree: 'Сертификат Browista',
        experience: '4 года',
        about: 'Дарья специализируется на ламинировании и перманентном макияже бровей. Создаёт натуральный и выразительный результат с учётом анатомии лица каждого клиента.',
        fees: 700,
        address: {
            line1: 'ул. Морская, д. 3',
            line2: 'Салон красоты «Glamour», каб. 6'
        }
    },
    {
        _id: 'doc7',
        name: 'Светлана Попова',
        image: doc7,
        speciality: 'Парикмахер',
        degree: 'Сертификат Wella',
        experience: '4 года',
        about: 'Светлана — универсальный парикмахер с опытом работы в Москве и Санкт-Петербурге. Выполняет мужские и женские стрижки, сложное окрашивание, кератиновое выпрямление.',
        fees: 1500,
        address: {
            line1: 'ул. Пушкина, д. 10',
            line2: 'Салон красоты «Glamour», каб. 7'
        }
    },
    {
        _id: 'doc8',
        name: 'Алина Козлова',
        image: doc8,
        speciality: 'Мастер маникюра',
        degree: 'Сертификат Naomi',
        experience: '3 года',
        about: 'Алина — опытный нейл-мастер с навыками ручной росписи. Создаёт дизайны от минимализма до сложных тематических работ. Использует только качественные материалы премиум-класса.',
        fees: 900,
        address: {
            line1: 'ул. Ленина, д. 5',
            line2: 'Салон красоты «Glamour», каб. 8'
        }
    },
    {
        _id: 'doc9',
        name: 'Юлия Морозова',
        image: doc9,
        speciality: 'Мастер педикюра',
        degree: 'Сертификат Gehwol',
        experience: '1 год',
        about: 'Юлия проводит классический и аппаратный педикюр, выполняет парафинотерапию и SPA-процедуры для ног. Знает технику работы со сложными ногтями и кожей стоп.',
        fees: 800,
        address: {
            line1: 'ул. Садовая, д. 12',
            line2: 'Салон красоты «Glamour», каб. 9'
        }
    },
    {
        _id: 'doc10',
        name: 'Виктория Лебедева',
        image: doc10,
        speciality: 'Визажист',
        degree: 'Сертификат MAC Cosmetics',
        experience: '2 года',
        about: 'Виктория — художник по макияжу, работает в стиле editorial и everyday look. Имеет большой портфолио свадебных работ. Проводит уроки макияжа для начинающих.',
        fees: 1200,
        address: {
            line1: 'ул. Цветочная, д. 8',
            line2: 'Салон красоты «Glamour», каб. 10'
        }
    },
    {
        _id: 'doc11',
        name: 'Кристина Орлова',
        image: doc11,
        speciality: 'Косметолог',
        degree: 'Диплом ГМУ, специализация косметология',
        experience: '4 года',
        about: 'Кристина — косметолог-эстетист. Выполняет чистки лица, пилинги, мезотерапию и биоревитализацию. Разрабатывает индивидуальные программы ухода за кожей.',
        fees: 2000,
        address: {
            line1: 'ул. Садовая, д. 12',
            line2: 'Салон красоты «Glamour», каб. 11'
        }
    },
    {
        _id: 'doc12',
        name: 'Алеся Федорова',
        image: doc12,
        speciality: 'Косметолог',
        degree: 'Сертификат Janssen Cosmetics',
        experience: '4 года',
        about: 'Алеся специализируется на аппаратной косметологии: RF-лифтинг, ультразвуковая чистка, микротоки. Помогает клиентам достигать заметного омолаживающего эффекта.',
        fees: 2000,
        address: {
            line1: 'ул. Садовая, д. 12',
            line2: 'Салон красоты «Glamour», каб. 12'
        }
    },
    {
        _id: 'doc13',
        name: 'Тамара Белова',
        image: doc13,
        speciality: 'Парикмахер',
        degree: 'Сертификат Schwarzkopf',
        experience: '4 года',
        about: 'Тамара — мастер стрижки и укладки. Специализируется на работе с кудрявыми и объёмными волосами. Выполняет свадебные причёски и вечерние укладки любой сложности.',
        fees: 1500,
        address: {
            line1: 'ул. Пушкина, д. 10',
            line2: 'Салон красоты «Glamour», каб. 13'
        }
    },
    {
        _id: 'doc14',
        name: 'Инна Захарова',
        image: doc14,
        speciality: 'Мастер маникюра',
        degree: 'Сертификат IBX',
        experience: '3 года',
        about: 'Инна — нейл-мастер, специализирующийся на восстановлении и укреплении ногтей. Работает с биогелем и акригелем. Выполняет японский маникюр и парафинотерапию.',
        fees: 900,
        address: {
            line1: 'ул. Ленина, д. 5',
            line2: 'Салон красоты «Glamour», каб. 14'
        }
    },
    {
        _id: 'doc15',
        name: 'Полина Степанова',
        image: doc15,
        speciality: 'Мастер педикюра',
        degree: 'Сертификат Comfort Zone',
        experience: '1 год',
        about: 'Полина выполняет классический, европейский и аппаратный педикюр. Работает с натуральными уходовыми составами. Предлагает расслабляющие SPA-ритуалы для ног.',
        fees: 800,
        address: {
            line1: 'ул. Садовая, д. 12',
            line2: 'Салон красоты «Glamour», каб. 15'
        }
    },
]
