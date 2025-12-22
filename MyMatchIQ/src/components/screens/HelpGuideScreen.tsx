import React, { useState } from 'react';
import { ArrowLeft, BookOpen, ChevronDown } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { SubscriptionTier } from '../../App';

interface HelpGuideScreenProps {
  onBack: () => void;
  tier: SubscriptionTier;
}

export function HelpGuideScreen({ onBack, tier }: HelpGuideScreenProps) {
  const { language } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const content = {
    en: {
      pageTitle: 'How MyMatchIQ Works',
      pageSubtitle: 'Clarity before connection. A guide to every feature.',
      intro: 'MyMatchIQ is a compatibility intelligence platform designed to help you understand alignment before forming an emotional bond.',
      introExtended: 'Here you'll find a clear guide to each feature: what it does, why it exists, and how to use it with intention.',
      philosophyTitle: 'Our Philosophy',
      philosophyPoints: [
        'Clarity before chemistry',
        'Consent before connection',
        'Depth over speed',
        'Intention over quantity'
      ],
      philosophyFooter: 'MyMatchIQ is not about meeting more people, but about making better decisions.',
      closingPhilosophy: 'MyMatchIQ is designed for adults who value clarity, consent, and intentional connection.',
      
      nav: {
        jumpTo: 'Jump to Feature',
        passport: 'Compatibility Passport',
        tiers: 'Depth of Reflection (Tiers)',
        singleScan: 'Single Scan',
        dualScan: 'Dual Scan',
        community: 'Assessment Community',
        requests: 'Passport Requests',
        connections: 'Active Connections',
        aiCoach: 'AI Coach',
        reflection: 'Reflection Weeks',
        privacy: 'Privacy & Consent'
      },
      
      sections: {
        passport: {
          title: 'Compatibility Passport',
          summary: 'Your private reflection profile built from structured questions',
          whatItIs: 'What it is',
          whatItIsBody: 'A structured self-assessment that captures how you see yourself across key relationship dimensions including values, communication style, emotional needs, lifestyle preferences, and future goals. Your passport is built through guided questions that prompt deep reflection.',
          whyItMatters: 'Why it matters',
          whyItMattersBody: 'Your passport is the foundation for all compatibility insights. It serves as your reference point for all scans and comparisons, allowing the system to surface meaningful alignment or misalignment with potential matches. The more complete your passport, the more accurate your compatibility insights.',
          howItWorks: 'How it works',
          howItWorksBody: 'Answer thoughtfully designed questions about yourself, your values, and what you're looking for. Your responses build a multi-dimensional profile that can be compared against others, shared selectively, and updated as you evolve. Questions are categorized by relationship domain and designed to reveal patterns you may not have articulated before.',
          accessLimits: 'Access & limits',
          accessLimitsBody: 'Available to all tiers. Free users complete a 15-question Lite Passport, Premier users access 25 questions (Standard Passport), and Elite users answer 45+ questions (Deep Passport). You can update your passport anytime, and changes immediately affect future compatibility calculations.'
        },
        tiers: {
          title: 'Depth of Reflection (Tiers)',
          summary: 'Three levels of self-assessment depth based on your subscription',
          whatItIs: 'What it is',
          whatItIsBody: 'A tiered system that determines how many questions you answer and how deep your self-reflection goes. Free tier offers foundational insights (15 questions), Premier provides intermediate depth (25 questions), and Elite unlocks comprehensive assessment (45+ questions).',
          whyItMatters: 'Why it matters',
          whyItMattersBody: 'More questions provide richer context for compatibility analysis. Deeper reflection leads to more nuanced insights about alignment, potential challenges, and relationship patterns. Your tier determines the confidence level of your compatibility scores and the specificity of AI Coach guidance.',
          howItWorks: 'How it works',
          howItWorksBody: 'Your subscription tier automatically determines which questions are available. As you upgrade, new questions unlock immediately, and you can complete them at your own pace. All previous answers are preserved, and new responses integrate seamlessly into your compatibility profile.',
          accessLimits: 'Access & limits',
          accessLimitsBody: 'Free: Lite Passport (15Q) · Premier: Standard Passport (25Q) · Elite: Deep Passport (45Q). You can upgrade anytime to unlock deeper questions. Downgrading preserves your answers, but some insights may become limited until you upgrade again.'
        },
        singleScan: {
          title: 'Single Scan (Private)',
          summary: 'Evaluate someone privately without their knowledge or involvement',
          whatItIs: 'What it is',
          whatItIsBody: 'A solo compatibility assessment where you answer questions about someone you're evaluating. The assessment is completely private—they never know you completed it, and no data is shared with them. Results are stored only in your account.',
          whyItMatters: 'Why it matters',
          whyItMattersBody: 'Single Scans let you explore compatibility early in the dating process, before you're ready to involve the other person. They're useful for first impressions, early dates, or situations where mutual evaluation isn't appropriate. Results help you decide whether to invest more time and emotional energy.',
          howItWorks: 'How it works',
          howItWorksBody: 'Select "Single Scan" from your dashboard. Answer guided questions about the person's communication style, values, behaviors, and how they align with your passport. The system compares their observed traits with your stated preferences and generates a compatibility score with detailed breakdowns by category.',
          accessLimits: 'Access & limits',
          accessLimitsBody: 'Available to all tiers. Free users can complete unlimited Single Scans but with limited question depth. Premier and Elite users access more detailed questions and receive deeper AI Coach insights on their results.'
        },
        dualScan: {
          title: 'Dual Scan (Mutual Consent)',
          summary: 'Collaborative compatibility assessment requiring agreement from both people',
          whatItIs: 'What it is',
          whatItIsBody: 'A mutual evaluation where both people independently answer questions about each other, then choose whether to reveal results. Both participants must consent before any information is shared. Results include mutual compatibility scores, alignment areas, and potential friction points.',
          whyItMatters: 'Why it matters',
          whyItMattersBody: 'Dual Scans provide deeper, more balanced insights than Single Scans because they capture how both people perceive the relationship. Mutual consent ensures trust and shared awareness. This feature promotes transparency and encourages healthy conversations about compatibility before emotional investment deepens.',
          howItWorks: 'How it works',
          howItWorksBody: 'Send a Dual Scan invite to someone. Both of you answer questions independently. Once both complete the assessment, you each decide whether to reveal results. If both consent, you unlock mutual insights including compatibility scores, aligned values, and areas that may need attention or conversation.',
          accessLimits: 'Access & limits',
          accessLimitsBody: 'Premier & Elite only. Dual Scans require both participants to have active accounts. Free users who receive an invite can participate, but results are limited by their tier. Elite users access extended question sets and deeper comparison analytics.'
        },
        community: {
          title: 'Assessment Community',
          summary: 'Connect with other MyMatchIQ users open to compatibility evaluation',
          whatItIs: 'What it is',
          whatItIsBody: 'A consent-based directory of MyMatchIQ users who have opted in to be discoverable for compatibility assessment. Profiles show only passport status (Lite, Standard, Deep) and basic readiness indicators—no photos, no bios, no messaging.',
          whyItMatters: 'Why it matters',
          whyItMattersBody: 'Assessment Community enables you to connect with people who share your interest in intentional, compatibility-first connection. It's not a dating app—it's a mutual evaluation platform where both parties agree to assess alignment before any emotional or social commitment.',
          howItWorks: 'How it works',
          howItWorksBody: 'Browse available participants. Request someone's Compatibility Passport, which automatically shares yours with them. They review your passport and decide whether to accept. If accepted, you both unlock comparison tools and mutual insights. All interactions are consent-gated and time-limited.',
          accessLimits: 'Access & limits',
          accessLimitsBody: 'Premier & Elite only. Participation requires a completed passport. You can send a limited number of requests per week based on your tier. All connections expire automatically after 30 days unless both parties choose to extend.'
        },
        requests: {
          title: 'Passport Requests',
          summary: 'Manage incoming and outgoing compatibility passport requests',
          whatItIs: 'What it is',
          whatItIsBody: 'A request system for exchanging compatibility passports with others. Incoming requests show you who wants access to your passport (and has shared theirs). Outgoing requests track who you've sent requests to and their response status.',
          whyItMatters: 'Why it matters',
          whyItMattersBody: 'Passport Requests ensure consent at every step. No one sees your passport without permission, and you control who you share with. Requests expire after 48 hours to prevent lingering access and maintain privacy. You can revoke access anytime.',
          howItWorks: 'How it works',
          howItWorksBody: 'When someone requests your passport, you see their passport first. Review it, then accept or decline. If you accept, your passport is shared, and both of you unlock comparison tools. You can pause or revoke access at any time, and the other person is notified appropriately.',
          accessLimits: 'Access & limits',
          accessLimitsBody: 'Premier & Elite only. Free users cannot send or receive passport requests. Requests expire after 48 hours. You can manage all active requests from the Connection Requests screen.'
        },
        connections: {
          title: 'Active Connections',
          summary: 'Manage ongoing compatibility connections and shared access',
          whatItIs: 'What it is',
          whatItIsBody: 'A list of people you've mutually shared passports with. Active connections grant access to comparison tools, AI Coach insights about your compatibility, and mutual reflection prompts. No messaging or free-text chat is included.',
          whyItMatters: 'Why it matters',
          whyItMattersBody: 'Active connections represent ongoing compatibility evaluation relationships. They're not "matches" or dates—they're structured assessment partnerships. This feature helps you track who has access to your passport and what insights you've unlocked together.',
          howItWorks: 'How it works',
          howItWorksBody: 'Once a passport request is accepted, the connection becomes active. You can view compatibility breakdowns, compare answers, and access AI Coach guidance on your alignment. Connections auto-expire after 30 days or can be paused/revoked manually.',
          accessLimits: 'Access & limits',
          accessLimitsBody: 'Premier & Elite only. All connections are time-limited and consent-based. You can pause (temporary) or revoke (permanent) access anytime. Free users cannot maintain active connections.'
        },
        aiCoach: {
          title: 'AI Coach',
          summary: 'Private reflective guidance to interpret your compatibility insights',
          whatItIs: 'What it is',
          whatItIsBody: 'A conversational AI tool that helps you understand what your compatibility results mean, explore patterns in your relationship preferences, and consider how to approach areas of alignment or misalignment. It does not make decisions for you, provide therapy, or offer clinical advice.',
          whyItMatters: 'Why it matters',
          whyItMattersBody: 'Compatibility scores are just numbers without context. The AI Coach translates data into actionable understanding. It prompts reflection, highlights patterns you might miss, and helps you think through what compatibility (or incompatibility) means for your specific situation.',
          howItWorks: 'How it works',
          howItWorksBody: 'Ask questions about your scan results, passport comparisons, or relationship patterns. The AI Coach responds based on your data, drawing connections between your stated values and observed behaviors. It encourages self-awareness, not prescription. You decide what to do with the insights.',
          accessLimits: 'Access & limits',
          accessLimitsBody: 'Free: Limited guidance on basic scans · Premier: Expanded insights and Reflection Week access · Elite: Unlimited coaching, advanced pattern analysis, and priority access to new AI features. AI Coach usage is capped per month on Free and Premier tiers.'
        },
        reflection: {
          title: 'Reflection Weeks',
          summary: 'Timed prompts for ongoing self-awareness and passport updates',
          whatItIs: 'What it is',
          whatItIsBody: 'Periodic check-ins (weekly, biweekly, or monthly depending on tier) that prompt you to revisit your passport, reflect on recent experiences, and update your answers. Reflection Weeks help you track how your priorities, values, and relationship goals shift over time.',
          whyItMatters: 'Why it matters',
          whyItMattersBody: 'Relationships and self-understanding evolve. What mattered six months ago might matter less now. Reflection Weeks ensure your passport stays current, your compatibility insights remain accurate, and you're aware of how you're changing as you date and grow.',
          howItWorks: 'How it works',
          howItWorksBody: 'You receive a notification when a Reflection Week begins. Complete guided prompts that ask you to reassess key areas of your passport. Your answers update automatically, and you can see how your compatibility with current or past scans has shifted. The AI Coach provides context on changes.',
          accessLimits: 'Access & limits',
          accessLimitsBody: 'Free: Limited Reflection Week access (1 per month) · Premier: Biweekly prompts with expanded guidance · Elite: Weekly prompts, custom reflection questions, and historical tracking of how your answers evolve.'
        },
        privacy: {
          title: 'Privacy & Consent',
          summary: 'How MyMatchIQ protects your data and ensures mutual agreement',
          whatItIs: 'What it is',
          whatItIsBody: 'A consent-first platform where nothing is shared without explicit permission. No data is visible to others unless you choose to share it. All sharing is time-limited, revocable, and tracked. MyMatchIQ does not sell data, create public profiles, or allow unsolicited contact.',
          whyItMatters: 'Why it matters',
          whyItMattersBody: 'Trust requires transparency. You need to know what's shared, with whom, and for how long. MyMatchIQ is built on the principle that compatibility evaluation is private, consensual, and protective of your emotional and informational boundaries.',
          howItWorks: 'How it works',
          howItWorksBody: 'Every feature that shares data requires explicit consent. Passport requests must be accepted. Dual Scans require mutual reveal. Expiring links auto-delete. You can revoke access anytime, and the system immediately removes shared data from the other person's view. All actions are logged for your review.',
          accessLimits: 'Access & limits',
          accessLimitsBody: 'Privacy protections are built into every tier. All users have full control over what they share and with whom. Elite users get advanced privacy controls including custom expiration times and granular sharing permissions.'
        }
      }
    },
    es: {
      pageTitle: 'Cómo funciona MyMatchIQ',
      pageSubtitle: 'Claridad antes de la conexión. Una guía de cada función.',
      intro: 'MyMatchIQ es una plataforma de inteligencia de compatibilidad diseñada para ayudarte a comprender la alineación antes de crear un vínculo emocional.',
      introExtended: 'Aquí encontrarás una guía clara de cada función: qué hace, por qué existe y cómo usarla de forma consciente.',
      philosophyTitle: 'Nuestra filosofía',
      philosophyPoints: [
        'Claridad antes de la química',
        'Consentimiento antes de la conexión',
        'Profundidad sobre rapidez',
        'Intención sobre cantidad'
      ],
      philosophyFooter: 'MyMatchIQ no se trata de conocer a más personas, sino de tomar mejores decisiones.',
      closingPhilosophy: 'MyMatchIQ está diseñado para adultos que valoran la claridad, el consentimiento y la conexión intencional.',
      
      nav: {
        jumpTo: 'Ir a función',
        passport: 'Pasaporte de Compatibilidad',
        tiers: 'Profundidad de Reflexión (Niveles)',
        singleScan: 'Escaneo Individual',
        dualScan: 'Escaneo Dual',
        community: 'Comunidad de Evaluación',
        requests: 'Solicitudes de Pasaporte',
        connections: 'Conexiones Activas',
        aiCoach: 'Coach IA',
        reflection: 'Semanas de Reflexión',
        privacy: 'Privacidad y Consentimiento'
      },
      
      sections: {
        passport: {
          title: 'Pasaporte de Compatibilidad',
          summary: 'Tu perfil de reflexión privado construido a partir de preguntas estructuradas',
          whatItIs: 'Qué es',
          whatItIsBody: 'Una autoevaluación estructurada que captura cómo te ves a través de dimensiones clave de relación, incluidos valores, estilo de comunicación, necesidades emocionales, preferencias de estilo de vida y objetivos futuros. Tu pasaporte se construye mediante preguntas guiadas que impulsan una reflexión profunda.',
          whyItMatters: 'Por qué importa',
          whyItMattersBody: 'Tu pasaporte es la base de todas las perspectivas de compatibilidad. Sirve como punto de referencia para todos los escaneos y comparaciones, permitiendo al sistema mostrar alineación o desalineación significativa con posibles coincidencias. Cuanto más completo sea tu pasaporte, más precisas serán tus perspectivas de compatibilidad.',
          howItWorks: 'Cómo funciona',
          howItWorksBody: 'Responde a preguntas cuidadosamente diseñadas sobre ti mismo, tus valores y lo que buscas. Tus respuestas construyen un perfil multidimensional que puede compararse con otros, compartirse selectivamente y actualizarse a medida que evolucionas. Las preguntas están categorizadas por dominio de relación y diseñadas para revelar patrones que quizás no hayas articulado antes.',
          accessLimits: 'Acceso y límites',
          accessLimitsBody: 'Disponible para todos los niveles. Los usuarios gratuitos completan un Pasaporte Lite de 15 preguntas, los usuarios Premier acceden a 25 preguntas (Pasaporte Estándar) y los usuarios Elite responden más de 45 preguntas (Pasaporte Profundo). Puedes actualizar tu pasaporte en cualquier momento y los cambios afectan inmediatamente los cálculos de compatibilidad futuros.'
        },
        tiers: {
          title: 'Profundidad de Reflexión (Niveles)',
          summary: 'Tres niveles de profundidad de autoevaluación según tu suscripción',
          whatItIs: 'Qué es',
          whatItIsBody: 'Un sistema escalonado que determina cuántas preguntas respondes y qué tan profunda es tu autorreflexión. El nivel gratuito ofrece perspectivas fundamentales (15 preguntas), Premier proporciona profundidad intermedia (25 preguntas) y Elite desbloquea evaluación integral (más de 45 preguntas).',
          whyItMatters: 'Por qué importa',
          whyItMattersBody: 'Más preguntas proporcionan un contexto más rico para el análisis de compatibilidad. Una reflexión más profunda conduce a perspectivas más matizadas sobre alineación, desafíos potenciales y patrones de relación. Tu nivel determina el nivel de confianza de tus puntuaciones de compatibilidad y la especificidad de la orientación del Coach IA.',
          howItWorks: 'Cómo funciona',
          howItWorksBody: 'Tu nivel de suscripción determina automáticamente qué preguntas están disponibles. Al actualizar, las nuevas preguntas se desbloquean de inmediato y puedes completarlas a tu propio ritmo. Todas las respuestas anteriores se conservan y las nuevas respuestas se integran sin problemas en tu perfil de compatibilidad.',
          accessLimits: 'Acceso y límites',
          accessLimitsBody: 'Gratuito: Pasaporte Lite (15P) · Premier: Pasaporte Estándar (25P) · Elite: Pasaporte Profundo (45P). Puedes actualizar en cualquier momento para desbloquear preguntas más profundas. Degradar conserva tus respuestas, pero algunas perspectivas pueden volverse limitadas hasta que actualices nuevamente.'
        },
        singleScan: {
          title: 'Escaneo Individual (Privado)',
          summary: 'Evalúa a alguien de forma privada sin su conocimiento o participación',
          whatItIs: 'Qué es',
          whatItIsBody: 'Una evaluación de compatibilidad individual en la que respondes preguntas sobre alguien que estás evaluando. La evaluación es completamente privada: nunca saben que la completaste y no se comparten datos con ellos. Los resultados se almacenan solo en tu cuenta.',
          whyItMatters: 'Por qué importa',
          whyItMattersBody: 'Los Escaneos Individuales te permiten explorar la compatibilidad en las primeras etapas del proceso de citas, antes de que estés listo para involucrar a la otra persona. Son útiles para primeras impresiones, primeras citas o situaciones en las que la evaluación mutua no es apropiada. Los resultados te ayudan a decidir si invertir más tiempo y energía emocional.',
          howItWorks: 'Cómo funciona',
          howItWorksBody: 'Selecciona "Escaneo Individual" desde tu panel. Responde preguntas guiadas sobre el estilo de comunicación, valores, comportamientos de la persona y cómo se alinean con tu pasaporte. El sistema compara sus rasgos observados con tus preferencias declaradas y genera una puntuación de compatibilidad con desgloses detallados por categoría.',
          accessLimits: 'Acceso y límites',
          accessLimitsBody: 'Disponible para todos los niveles. Los usuarios gratuitos pueden completar Escaneos Individuales ilimitados pero con profundidad de preguntas limitada. Los usuarios Premier y Elite acceden a preguntas más detalladas y reciben perspectivas más profundas del Coach IA sobre sus resultados.'
        },
        dualScan: {
          title: 'Escaneo Dual (Consentimiento Mutuo)',
          summary: 'Evaluación de compatibilidad colaborativa que requiere acuerdo de ambas personas',
          whatItIs: 'Qué es',
          whatItIsBody: 'Una evaluación mutua en la que ambas personas responden preguntas sobre la otra de forma independiente, luego eligen si revelar los resultados. Ambos participantes deben dar su consentimiento antes de compartir cualquier información. Los resultados incluyen puntuaciones de compatibilidad mutua, áreas de alineación y posibles puntos de fricción.',
          whyItMatters: 'Por qué importa',
          whyItMattersBody: 'Los Escaneos Duales proporcionan perspectivas más profundas y equilibradas que los Escaneos Individuales porque capturan cómo ambas personas perciben la relación. El consentimiento mutuo garantiza confianza y conciencia compartida. Esta función promueve la transparencia y fomenta conversaciones saludables sobre compatibilidad antes de que se profundice la inversión emocional.',
          howItWorks: 'Cómo funciona',
          howItWorksBody: 'Envía una invitación de Escaneo Dual a alguien. Ambos responden preguntas de forma independiente. Una vez que ambos completan la evaluación, cada uno decide si revelar los resultados. Si ambos dan su consentimiento, desbloqueas perspectivas mutuas que incluyen puntuaciones de compatibilidad, valores alineados y áreas que pueden necesitar atención o conversación.',
          accessLimits: 'Acceso y límites',
          accessLimitsBody: 'Solo Premier y Elite. Los Escaneos Duales requieren que ambos participantes tengan cuentas activas. Los usuarios gratuitos que reciben una invitación pueden participar, pero los resultados están limitados por su nivel. Los usuarios Elite acceden a conjuntos de preguntas extendidos y análisis de comparación más profundos.'
        },
        community: {
          title: 'Comunidad de Evaluación',
          summary: 'Conéctate con otros usuarios de MyMatchIQ abiertos a la evaluación de compatibilidad',
          whatItIs: 'Qué es',
          whatItIsBody: 'Un directorio basado en consentimiento de usuarios de MyMatchIQ que han optado por ser descubribles para evaluación de compatibilidad. Los perfiles muestran solo el estado del pasaporte (Lite, Estándar, Profundo) y indicadores básicos de disponibilidad: sin fotos, sin biografías, sin mensajes.',
          whyItMatters: 'Por qué importa',
          whyItMattersBody: 'La Comunidad de Evaluación te permite conectarte con personas que comparten tu interés en conexiones intencionales y centradas en la compatibilidad. No es una aplicación de citas: es una plataforma de evaluación mutua donde ambas partes acuerdan evaluar la alineación antes de cualquier compromiso emocional o social.',
          howItWorks: 'Cómo funciona',
          howItWorksBody: 'Explora participantes disponibles. Solicita el Pasaporte de Compatibilidad de alguien, que automáticamente comparte el tuyo con ellos. Ellos revisan tu pasaporte y deciden si aceptar. Si aceptan, ambos desbloquean herramientas de comparación e perspectivas mutuas. Todas las interacciones requieren consentimiento y tienen tiempo limitado.',
          accessLimits: 'Acceso y límites',
          accessLimitsBody: 'Solo Premier y Elite. La participación requiere un pasaporte completo. Puedes enviar un número limitado de solicitudes por semana según tu nivel. Todas las conexiones caducan automáticamente después de 30 días a menos que ambas partes elijan extenderlas.'
        },
        requests: {
          title: 'Solicitudes de Pasaporte',
          summary: 'Gestiona solicitudes de pasaporte de compatibilidad entrantes y salientes',
          whatItIs: 'Qué es',
          whatItIsBody: 'Un sistema de solicitudes para intercambiar pasaportes de compatibilidad con otros. Las solicitudes entrantes te muestran quién quiere acceso a tu pasaporte (y ha compartido el suyo). Las solicitudes salientes rastrean a quién has enviado solicitudes y su estado de respuesta.',
          whyItMatters: 'Por qué importa',
          whyItMattersBody: 'Las Solicitudes de Pasaporte garantizan el consentimiento en cada paso. Nadie ve tu pasaporte sin permiso y tú controlas con quién compartes. Las solicitudes caducan después de 48 horas para evitar accesos persistentes y mantener la privacidad. Puedes revocar el acceso en cualquier momento.',
          howItWorks: 'Cómo funciona',
          howItWorksBody: 'Cuando alguien solicita tu pasaporte, ves el suyo primero. Revísalo, luego acepta o rechaza. Si aceptas, tu pasaporte se comparte y ambos desbloquean herramientas de comparación. Puedes pausar o revocar el acceso en cualquier momento, y la otra persona es notificada apropiadamente.',
          accessLimits: 'Acceso y límites',
          accessLimitsBody: 'Solo Premier y Elite. Los usuarios gratuitos no pueden enviar ni recibir solicitudes de pasaporte. Las solicitudes caducan después de 48 horas. Puedes gestionar todas las solicitudes activas desde la pantalla de Solicitudes de Conexión.'
        },
        connections: {
          title: 'Conexiones Activas',
          summary: 'Gestiona conexiones de compatibilidad en curso y acceso compartido',
          whatItIs: 'Qué es',
          whatItIsBody: 'Una lista de personas con las que has compartido pasaportes mutuamente. Las conexiones activas otorgan acceso a herramientas de comparación, perspectivas del Coach IA sobre tu compatibilidad y avisos de reflexión mutua. No se incluyen mensajes ni chat de texto libre.',
          whyItMatters: 'Por qué importa',
          whyItMattersBody: 'Las conexiones activas representan relaciones de evaluación de compatibilidad en curso. No son "coincidencias" ni citas: son asociaciones de evaluación estructuradas. Esta función te ayuda a rastrear quién tiene acceso a tu pasaporte y qué perspectivas has desbloqueado juntos.',
          howItWorks: 'Cómo funciona',
          howItWorksBody: 'Una vez que se acepta una solicitud de pasaporte, la conexión se activa. Puedes ver desgloses de compatibilidad, comparar respuestas y acceder a orientación del Coach IA sobre tu alineación. Las conexiones caducan automáticamente después de 30 días o pueden pausarse/revocarse manualmente.',
          accessLimits: 'Acceso y límites',
          accessLimitsBody: 'Solo Premier y Elite. Todas las conexiones tienen tiempo limitado y se basan en el consentimiento. Puedes pausar (temporal) o revocar (permanente) el acceso en cualquier momento. Los usuarios gratuitos no pueden mantener conexiones activas.'
        },
        aiCoach: {
          title: 'Coach IA',
          summary: 'Orientación reflexiva privada para interpretar tus perspectivas de compatibilidad',
          whatItIs: 'Qué es',
          whatItIsBody: 'Una herramienta de IA conversacional que te ayuda a comprender qué significan tus resultados de compatibilidad, explorar patrones en tus preferencias de relación y considerar cómo abordar áreas de alineación o desalineación. No toma decisiones por ti, no proporciona terapia ni ofrece consejos clínicos.',
          whyItMatters: 'Por qué importa',
          whyItMattersBody: 'Las puntuaciones de compatibilidad son solo números sin contexto. El Coach IA traduce los datos en comprensión procesable. Impulsa la reflexión, destaca patrones que podrías pasar por alto y te ayuda a pensar qué significa la compatibilidad (o incompatibilidad) para tu situación específica.',
          howItWorks: 'Cómo funciona',
          howItWorksBody: 'Haz preguntas sobre los resultados de tu escaneo, comparaciones de pasaportes o patrones de relación. El Coach IA responde basándose en tus datos, estableciendo conexiones entre tus valores declarados y comportamientos observados. Fomenta la autoconciencia, no la prescripción. Tú decides qué hacer con las perspectivas.',
          accessLimits: 'Acceso y límites',
          accessLimitsBody: 'Gratuito: Orientación limitada en escaneos básicos · Premier: Perspectivas ampliadas y acceso a Semana de Reflexión · Elite: Coaching ilimitado, análisis avanzado de patrones y acceso prioritario a nuevas funciones de IA. El uso del Coach IA tiene un límite mensual en los niveles Gratuito y Premier.'
        },
        reflection: {
          title: 'Semanas de Reflexión',
          summary: 'Avisos programados para autoconciencia continua y actualizaciones de pasaporte',
          whatItIs: 'Qué es',
          whatItIsBody: 'Controles periódicos (semanales, quincenales o mensuales según el nivel) que te invitan a revisar tu pasaporte, reflexionar sobre experiencias recientes y actualizar tus respuestas. Las Semanas de Reflexión te ayudan a rastrear cómo cambian tus prioridades, valores y objetivos de relación con el tiempo.',
          whyItMatters: 'Por qué importa',
          whyItMattersBody: 'Las relaciones y la autocomprensión evolucionan. Lo que importaba hace seis meses puede importar menos ahora. Las Semanas de Reflexión garantizan que tu pasaporte se mantenga actualizado, tus perspectivas de compatibilidad sigan siendo precisas y seas consciente de cómo estás cambiando mientras sales y creces.',
          howItWorks: 'Cómo funciona',
          howItWorksBody: 'Recibes una notificación cuando comienza una Semana de Reflexión. Completa avisos guiados que te piden reevaluar áreas clave de tu pasaporte. Tus respuestas se actualizan automáticamente y puedes ver cómo ha cambiado tu compatibilidad con escaneos actuales o pasados. El Coach IA proporciona contexto sobre los cambios.',
          accessLimits: 'Acceso y límites',
          accessLimitsBody: 'Gratuito: Acceso limitado a Semana de Reflexión (1 por mes) · Premier: Avisos quincenales con orientación ampliada · Elite: Avisos semanales, preguntas de reflexión personalizadas y seguimiento histórico de cómo evolucionan tus respuestas.'
        },
        privacy: {
          title: 'Privacidad y Consentimiento',
          summary: 'Cómo MyMatchIQ protege tus datos y garantiza el acuerdo mutuo',
          whatItIs: 'Qué es',
          whatItIsBody: 'Una plataforma que prioriza el consentimiento donde nada se comparte sin permiso explícito. Ningún dato es visible para otros a menos que elijas compartirlo. Todo el intercambio tiene tiempo limitado, es revocable y se rastrea. MyMatchIQ no vende datos, crea perfiles públicos ni permite contacto no solicitado.',
          whyItMatters: 'Por qué importa',
          whyItMattersBody: 'La confianza requiere transparencia. Necesitas saber qué se comparte, con quién y por cuánto tiempo. MyMatchIQ se basa en el principio de que la evaluación de compatibilidad es privada, consensuada y protege tus límites emocionales e informativos.',
          howItWorks: 'Cómo funciona',
          howItWorksBody: 'Cada función que comparte datos requiere consentimiento explícito. Las solicitudes de pasaporte deben aceptarse. Los Escaneos Duales requieren revelación mutua. Los enlaces que caducan se eliminan automáticamente. Puedes revocar el acceso en cualquier momento, y el sistema elimina inmediatamente los datos compartidos de la vista de la otra persona. Todas las acciones se registran para tu revisión.',
          accessLimits: 'Acceso y límites',
          accessLimitsBody: 'Las protecciones de privacidad están integradas en cada nivel. Todos los usuarios tienen control total sobre lo que comparten y con quién. Los usuarios Elite obtienen controles avanzados de privacidad que incluyen tiempos de caducidad personalizados y permisos de intercambio granulares.'
        }
      }
    },
    fr: {
      pageTitle: 'Comment fonctionne MyMatchIQ',
      pageSubtitle: 'La clarté avant la connexion. Un guide de chaque fonctionnalité.',
      intro: 'MyMatchIQ est une plateforme d\'intelligence de compatibilité conçue pour vous aider à évaluer l\'alignement avant tout engagement émotionnel.',
      introExtended: 'Ce guide explique chaque fonctionnalité : son utilité, son objectif et la meilleure façon de l\'utiliser avec intention.',
      philosophyTitle: 'Notre philosophie',
      philosophyPoints: [
        'La clarté avant la chimie',
        'Le consentement avant la connexion',
        'La profondeur plutôt que la rapidité',
        'L\'intention plutôt que la quantité'
      ],
      philosophyFooter: 'MyMatchIQ ne consiste pas à rencontrer plus de personnes, mais à prendre de meilleures décisions.',
      closingPhilosophy: 'MyMatchIQ est conçu pour les adultes qui valorisent la clarté, le consentement et la connexion intentionnelle.',
      
      nav: {
        jumpTo: 'Aller à la fonction',
        passport: 'Passeport de Compatibilité',
        tiers: 'Profondeur de Réflexion (Niveaux)',
        singleScan: 'Analyse Individuelle',
        dualScan: 'Analyse Duale',
        community: 'Communauté d\'Évaluation',
        requests: 'Demandes de Passeport',
        connections: 'Connexions Actives',
        aiCoach: 'Coach IA',
        reflection: 'Semaines de Réflexion',
        privacy: 'Confidentialité et Consentement'
      },
      
      sections: {
        passport: {
          title: 'Passeport de Compatibilité',
          summary: 'Votre profil de réflexion privé construit à partir de questions structurées',
          whatItIs: 'Ce que c\'est',
          whatItIsBody: 'Une auto-évaluation structurée qui capture votre perception de vous-même à travers des dimensions relationnelles clés, notamment les valeurs, le style de communication, les besoins émotionnels, les préférences de style de vie et les objectifs futurs. Votre passeport est construit à travers des questions guidées qui encouragent une réflexion profonde.',
          whyItMatters: 'Pourquoi c\'est important',
          whyItMattersBody: 'Votre passeport est le fondement de toutes les perspectives de compatibilité. Il sert de point de référence pour toutes les analyses et comparaisons, permettant au système de révéler un alignement ou un désalignement significatif avec les correspondances potentielles. Plus votre passeport est complet, plus vos perspectives de compatibilité sont précises.',
          howItWorks: 'Comment ça fonctionne',
          howItWorksBody: 'Répondez à des questions soigneusement conçues sur vous-même, vos valeurs et ce que vous recherchez. Vos réponses construisent un profil multidimensionnel qui peut être comparé à d\'autres, partagé sélectivement et mis à jour au fur et à mesure de votre évolution. Les questions sont catégorisées par domaine relationnel et conçues pour révéler des schémas que vous n\'aviez peut-être pas articulés auparavant.',
          accessLimits: 'Accès et limites',
          accessLimitsBody: 'Disponible pour tous les niveaux. Les utilisateurs gratuits complètent un Passeport Lite de 15 questions, les utilisateurs Premier accèdent à 25 questions (Passeport Standard) et les utilisateurs Elite répondent à plus de 45 questions (Passeport Profond). Vous pouvez mettre à jour votre passeport à tout moment et les modifications affectent immédiatement les calculs de compatibilité futurs.'
        },
        tiers: {
          title: 'Profondeur de Réflexion (Niveaux)',
          summary: 'Trois niveaux de profondeur d\'auto-évaluation selon votre abonnement',
          whatItIs: 'Ce que c\'est',
          whatItIsBody: 'Un système à plusieurs niveaux qui détermine combien de questions vous répondez et la profondeur de votre auto-réflexion. Le niveau gratuit offre des perspectives fondamentales (15 questions), Premier fournit une profondeur intermédiaire (25 questions) et Elite déverrouille une évaluation complète (plus de 45 questions).',
          whyItMatters: 'Pourquoi c\'est important',
          whyItMattersBody: 'Plus de questions fournissent un contexte plus riche pour l\'analyse de compatibilité. Une réflexion plus profonde conduit à des perspectives plus nuancées sur l\'alignement, les défis potentiels et les schémas relationnels. Votre niveau détermine le niveau de confiance de vos scores de compatibilité et la spécificité des conseils du Coach IA.',
          howItWorks: 'Comment ça fonctionne',
          howItWorksBody: 'Votre niveau d\'abonnement détermine automatiquement quelles questions sont disponibles. Lorsque vous mettez à niveau, de nouvelles questions se déverrouillent immédiatement et vous pouvez les compléter à votre rythme. Toutes les réponses précédentes sont conservées et les nouvelles réponses s\'intègrent parfaitement à votre profil de compatibilité.',
          accessLimits: 'Accès et limites',
          accessLimitsBody: 'Gratuit : Passeport Lite (15Q) · Premier : Passeport Standard (25Q) · Elite : Passeport Profond (45Q). Vous pouvez mettre à niveau à tout moment pour déverrouiller des questions plus profondes. La rétrogradation préserve vos réponses, mais certaines perspectives peuvent devenir limitées jusqu\'à ce que vous mettiez à niveau à nouveau.'
        },
        singleScan: {
          title: 'Analyse Individuelle (Privée)',
          summary: 'Évaluez quelqu\'un en privé sans sa connaissance ou sa participation',
          whatItIs: 'Ce que c\'est',
          whatItIsBody: 'Une évaluation de compatibilité solo où vous répondez à des questions sur quelqu\'un que vous évaluez. L\'évaluation est complètement privée : ils ne savent jamais que vous l\'avez complétée et aucune donnée n\'est partagée avec eux. Les résultats sont stockés uniquement dans votre compte.',
          whyItMatters: 'Pourquoi c\'est important',
          whyItMattersBody: 'Les Analyses Individuelles vous permettent d\'explorer la compatibilité au début du processus de rencontre, avant d\'être prêt à impliquer l\'autre personne. Elles sont utiles pour les premières impressions, les premiers rendez-vous ou les situations où l\'évaluation mutuelle n\'est pas appropriée. Les résultats vous aident à décider d\'investir plus de temps et d\'énergie émotionnelle.',
          howItWorks: 'Comment ça fonctionne',
          howItWorksBody: 'Sélectionnez "Analyse Individuelle" depuis votre tableau de bord. Répondez à des questions guidées sur le style de communication, les valeurs, les comportements de la personne et comment ils s\'alignent avec votre passeport. Le système compare leurs traits observés avec vos préférences déclarées et génère un score de compatibilité avec des détails par catégorie.',
          accessLimits: 'Accès et limites',
          accessLimitsBody: 'Disponible pour tous les niveaux. Les utilisateurs gratuits peuvent compléter des Analyses Individuelles illimitées mais avec une profondeur de questions limitée. Les utilisateurs Premier et Elite accèdent à des questions plus détaillées et reçoivent des perspectives plus profondes du Coach IA sur leurs résultats.'
        },
        dualScan: {
          title: 'Analyse Duale (Consentement Mutuel)',
          summary: 'Évaluation de compatibilité collaborative nécessitant l\'accord des deux personnes',
          whatItIs: 'Ce que c\'est',
          whatItIsBody: 'Une évaluation mutuelle où les deux personnes répondent indépendamment à des questions l\'une sur l\'autre, puis choisissent de révéler ou non les résultats. Les deux participants doivent consentir avant que toute information ne soit partagée. Les résultats incluent des scores de compatibilité mutuels, des domaines d\'alignement et des points de friction potentiels.',
          whyItMatters: 'Pourquoi c\'est important',
          whyItMattersBody: 'Les Analyses Duales fournissent des perspectives plus profondes et équilibrées que les Analyses Individuelles car elles capturent comment les deux personnes perçoivent la relation. Le consentement mutuel garantit la confiance et la conscience partagée. Cette fonctionnalité favorise la transparence et encourage des conversations saines sur la compatibilité avant que l\'investissement émotionnel ne s\'approfondisse.',
          howItWorks: 'Comment ça fonctionne',
          howItWorksBody: 'Envoyez une invitation d\'Analyse Duale à quelqu\'un. Vous répondez tous les deux à des questions indépendamment. Une fois que les deux ont terminé l\'évaluation, chacun décide de révéler ou non les résultats. Si les deux consentent, vous déverrouillez des perspectives mutuelles incluant des scores de compatibilité, des valeurs alignées et des domaines pouvant nécessiter attention ou conversation.',
          accessLimits: 'Accès et limites',
          accessLimitsBody: 'Premier et Elite uniquement. Les Analyses Duales nécessitent que les deux participants aient des comptes actifs. Les utilisateurs gratuits qui reçoivent une invitation peuvent participer, mais les résultats sont limités par leur niveau. Les utilisateurs Elite accèdent à des ensembles de questions étendus et à une analytique de comparaison plus approfondie.'
        },
        community: {
          title: 'Communauté d\'Évaluation',
          summary: 'Connectez-vous avec d\'autres utilisateurs MyMatchIQ ouverts à l\'évaluation de compatibilité',
          whatItIs: 'Ce que c\'est',
          whatItIsBody: 'Un répertoire basé sur le consentement d\'utilisateurs MyMatchIQ qui ont choisi d\'être découvrables pour l\'évaluation de compatibilité. Les profils montrent uniquement le statut du passeport (Lite, Standard, Profond) et des indicateurs de disponibilité de base : pas de photos, pas de biographies, pas de messagerie.',
          whyItMatters: 'Pourquoi c\'est important',
          whyItMattersBody: 'La Communauté d\'Évaluation vous permet de vous connecter avec des personnes qui partagent votre intérêt pour une connexion intentionnelle et axée sur la compatibilité. Ce n\'est pas une application de rencontre : c\'est une plateforme d\'évaluation mutuelle où les deux parties acceptent d\'évaluer l\'alignement avant tout engagement émotionnel ou social.',
          howItWorks: 'Comment ça fonctionne',
          howItWorksBody: 'Parcourez les participants disponibles. Demandez le Passeport de Compatibilité de quelqu\'un, ce qui partage automatiquement le vôtre avec eux. Ils examinent votre passeport et décident d\'accepter ou non. S\'ils acceptent, vous déverrouillez tous les deux des outils de comparaison et des perspectives mutuelles. Toutes les interactions nécessitent un consentement et sont limitées dans le temps.',
          accessLimits: 'Accès et limites',
          accessLimitsBody: 'Premier et Elite uniquement. La participation nécessite un passeport complété. Vous pouvez envoyer un nombre limité de demandes par semaine selon votre niveau. Toutes les connexions expirent automatiquement après 30 jours à moins que les deux parties ne choisissent de prolonger.'
        },
        requests: {
          title: 'Demandes de Passeport',
          summary: 'Gérez les demandes de passeport de compatibilité entrantes et sortantes',
          whatItIs: 'Ce que c\'est',
          whatItIsBody: 'Un système de demandes pour échanger des passeports de compatibilité avec d\'autres. Les demandes entrantes vous montrent qui veut accéder à votre passeport (et a partagé le leur). Les demandes sortantes suivent à qui vous avez envoyé des demandes et leur statut de réponse.',
          whyItMatters: 'Pourquoi c\'est important',
          whyItMattersBody: 'Les Demandes de Passeport garantissent le consentement à chaque étape. Personne ne voit votre passeport sans permission, et vous contrôlez avec qui vous partagez. Les demandes expirent après 48 heures pour éviter l\'accès persistant et maintenir la confidentialité. Vous pouvez révoquer l\'accès à tout moment.',
          howItWorks: 'Comment ça fonctionne',
          howItWorksBody: 'Lorsque quelqu\'un demande votre passeport, vous voyez d\'abord le leur. Examinez-le, puis acceptez ou refusez. Si vous acceptez, votre passeport est partagé, et vous déverrouillez tous les deux des outils de comparaison. Vous pouvez suspendre ou révoquer l\'accès à tout moment, et l\'autre personne est notifiée de manière appropriée.',
          accessLimits: 'Accès et limites',
          accessLimitsBody: 'Premier et Elite uniquement. Les utilisateurs gratuits ne peuvent pas envoyer ou recevoir de demandes de passeport. Les demandes expirent après 48 heures. Vous pouvez gérer toutes les demandes actives depuis l\'écran Demandes de Connexion.'
        },
        connections: {
          title: 'Connexions Actives',
          summary: 'Gérez les connexions de compatibilité en cours et l\'accès partagé',
          whatItIs: 'Ce que c\'est',
          whatItIsBody: 'Une liste de personnes avec qui vous avez mutuellement partagé des passeports. Les connexions actives accordent l\'accès aux outils de comparaison, aux perspectives du Coach IA sur votre compatibilité et aux invites de réflexion mutuelle. Aucune messagerie ou chat de texte libre n\'est inclus.',
          whyItMatters: 'Pourquoi c\'est important',
          whyItMattersBody: 'Les connexions actives représentent des relations d\'évaluation de compatibilité en cours. Ce ne sont pas des "correspondances" ou des rendez-vous : ce sont des partenariats d\'évaluation structurés. Cette fonctionnalité vous aide à suivre qui a accès à votre passeport et quelles perspectives vous avez déverrouillées ensemble.',
          howItWorks: 'Comment ça fonctionne',
          howItWorksBody: 'Une fois qu\'une demande de passeport est acceptée, la connexion devient active. Vous pouvez voir les détails de compatibilité, comparer les réponses et accéder aux conseils du Coach IA sur votre alignement. Les connexions expirent automatiquement après 30 jours ou peuvent être suspendues/révoquées manuellement.',
          accessLimits: 'Accès et limites',
          accessLimitsBody: 'Premier et Elite uniquement. Toutes les connexions sont limitées dans le temps et basées sur le consentement. Vous pouvez suspendre (temporaire) ou révoquer (permanent) l\'accès à tout moment. Les utilisateurs gratuits ne peuvent pas maintenir de connexions actives.'
        },
        aiCoach: {
          title: 'Coach IA',
          summary: 'Conseils réflexifs privés pour interpréter vos perspectives de compatibilité',
          whatItIs: 'Ce que c\'est',
          whatItIsBody: 'Un outil d\'IA conversationnelle qui vous aide à comprendre ce que signifient vos résultats de compatibilité, à explorer les schémas dans vos préférences relationnelles et à considérer comment aborder les domaines d\'alignement ou de désalignement. Il ne prend pas de décisions pour vous, ne fournit pas de thérapie et n\'offre pas de conseils cliniques.',
          whyItMatters: 'Pourquoi c\'est important',
          whyItMattersBody: 'Les scores de compatibilité ne sont que des chiffres sans contexte. Le Coach IA traduit les données en compréhension exploitable. Il encourage la réflexion, met en évidence les schémas que vous pourriez manquer et vous aide à réfléchir à ce que la compatibilité (ou l\'incompatibilité) signifie pour votre situation spécifique.',
          howItWorks: 'Comment ça fonctionne',
          howItWorksBody: 'Posez des questions sur vos résultats d\'analyse, les comparaisons de passeports ou les schémas relationnels. Le Coach IA répond en fonction de vos données, établissant des liens entre vos valeurs déclarées et vos comportements observés. Il encourage la conscience de soi, pas la prescription. Vous décidez quoi faire des perspectives.',
          accessLimits: 'Accès et limites',
          accessLimitsBody: 'Gratuit : Conseils limités sur les analyses de base · Premier : Perspectives étendues et accès aux Semaines de Réflexion · Elite : Coaching illimité, analyse avancée des schémas et accès prioritaire aux nouvelles fonctionnalités IA. L\'utilisation du Coach IA est plafonnée par mois sur les niveaux Gratuit et Premier.'
        },
        reflection: {
          title: 'Semaines de Réflexion',
          summary: 'Invites programmées pour une prise de conscience continue et des mises à jour de passeport',
          whatItIs: 'Ce que c\'est',
          whatItIsBody: 'Des contrôles périodiques (hebdomadaires, bihebdomadaires ou mensuels selon le niveau) qui vous invitent à revisiter votre passeport, à réfléchir sur des expériences récentes et à mettre à jour vos réponses. Les Semaines de Réflexion vous aident à suivre l\'évolution de vos priorités, valeurs et objectifs relationnels au fil du temps.',
          whyItMatters: 'Pourquoi c\'est important',
          whyItMattersBody: 'Les relations et la compréhension de soi évoluent. Ce qui comptait il y a six mois peut compter moins maintenant. Les Semaines de Réflexion garantissent que votre passeport reste à jour, vos perspectives de compatibilité restent précises et vous êtes conscient de votre évolution en rencontrant et en grandissant.',
          howItWorks: 'Comment ça fonctionne',
          howItWorksBody: 'Vous recevez une notification lorsqu\'une Semaine de Réflexion commence. Complétez des invites guidées qui vous demandent de réévaluer les domaines clés de votre passeport. Vos réponses se mettent à jour automatiquement et vous pouvez voir comment votre compatibilité avec les analyses actuelles ou passées a évolué. Le Coach IA fournit un contexte sur les changements.',
          accessLimits: 'Accès et limites',
          accessLimitsBody: 'Gratuit : Accès limité aux Semaines de Réflexion (1 par mois) · Premier : Invites bihebdomadaires avec conseils étendus · Elite : Invites hebdomadaires, questions de réflexion personnalisées et suivi historique de l\'évolution de vos réponses.'
        },
        privacy: {
          title: 'Confidentialité et Consentement',
          summary: 'Comment MyMatchIQ protège vos données et garantit l\'accord mutuel',
          whatItIs: 'Ce que c\'est',
          whatItIsBody: 'Une plateforme axée sur le consentement où rien n\'est partagé sans permission explicite. Aucune donnée n\'est visible par d\'autres à moins que vous ne choisissiez de la partager. Tout partage est limité dans le temps, révocable et suivi. MyMatchIQ ne vend pas de données, ne crée pas de profils publics et n\'autorise pas les contacts non sollicités.',
          whyItMatters: 'Pourquoi c\'est important',
          whyItMattersBody: 'La confiance nécessite de la transparence. Vous devez savoir ce qui est partagé, avec qui et pour combien de temps. MyMatchIQ est construit sur le principe que l\'évaluation de compatibilité est privée, consensuelle et protège vos limites émotionnelles et informationnelles.',
          howItWorks: 'Comment ça fonctionne',
          howItWorksBody: 'Chaque fonctionnalité qui partage des données nécessite un consentement explicite. Les demandes de passeport doivent être acceptées. Les Analyses Duales nécessitent une révélation mutuelle. Les liens expirants s\'autodétruisent. Vous pouvez révoquer l\'accès à tout moment, et le système supprime immédiatement les données partagées de la vue de l\'autre personne. Toutes les actions sont enregistrées pour votre examen.',
          accessLimits: 'Accès et limites',
          accessLimitsBody: 'Les protections de confidentialité sont intégrées à tous les niveaux. Tous les utilisateurs ont un contrôle total sur ce qu\'ils partagent et avec qui. Les utilisateurs Elite obtiennent des contrôles avancés de confidentialité incluant des durées d\'expiration personnalisées et des autorisations de partage granulaires.'
        }
      }
    }
  };

  const currentContent = content[language];
  const sections = [
    { id: 'passport', label: currentContent.nav.passport, content: currentContent.sections.passport },
    { id: 'tiers', label: currentContent.nav.tiers, content: currentContent.sections.tiers },
    { id: 'singleScan', label: currentContent.nav.singleScan, content: currentContent.sections.singleScan },
    { id: 'dualScan', label: currentContent.nav.dualScan, content: currentContent.sections.dualScan },
    { id: 'community', label: currentContent.nav.community, content: currentContent.sections.community },
    { id: 'requests', label: currentContent.nav.requests, content: currentContent.sections.requests },
    { id: 'connections', label: currentContent.nav.connections, content: currentContent.sections.connections },
    { id: 'aiCoach', label: currentContent.nav.aiCoach, content: currentContent.sections.aiCoach },
    { id: 'reflection', label: currentContent.nav.reflection, content: currentContent.sections.reflection },
    { id: 'privacy', label: currentContent.nav.privacy, content: currentContent.sections.privacy }
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-rose-100">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-rose-600 hover:text-rose-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            <BookOpen className="w-6 h-6 text-rose-500" />
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-2 flex-wrap">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className="px-3 py-1.5 text-sm bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-full transition-colors"
              >
                {section.label}
              </button>
            ))}
          </div>

          {/* Mobile Dropdown */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-full flex items-center justify-between px-4 py-2.5 bg-rose-50 rounded-lg text-rose-700"
            >
              <span className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>{currentContent.nav.jumpTo}</span>
              </span>
              <ChevronDown className={`w-5 h-5 transition-transform ${mobileMenuOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {mobileMenuOpen && (
              <div className="mt-2 bg-white rounded-lg shadow-lg border border-rose-100 overflow-hidden">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className="w-full text-left px-4 py-3 hover:bg-rose-50 text-rose-700 border-b border-rose-50 last:border-b-0 transition-colors"
                  >
                    {section.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 py-8 pb-20">
        {/* Page Title */}
        <div className="mb-12 text-center">
          <h1 className="text-rose-900 mb-3">{currentContent.pageTitle}</h1>
          <p className="text-rose-600">{currentContent.pageSubtitle}</p>
        </div>

        {/* Introduction */}
        <div className="mb-12 p-6 bg-white rounded-2xl shadow-sm border border-rose-100">
          <p className="text-gray-700 mb-3">{currentContent.intro}</p>
          <p className="text-gray-600">{currentContent.introExtended}</p>
        </div>

        {/* Philosophy */}
        <div className="mb-16 p-6 bg-gradient-to-br from-rose-50 to-purple-50 rounded-2xl border border-rose-100">
          <h2 className="text-rose-900 mb-4">{currentContent.philosophyTitle}</h2>
          <ul className="space-y-2 mb-4">
            {currentContent.philosophyPoints.map((point, index) => (
              <li key={index} className="flex items-start gap-3 text-gray-700">
                <span className="text-rose-500 mt-1">•</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
          <p className="text-gray-600 italic">{currentContent.philosophyFooter}</p>
        </div>

        {/* Feature Sections */}
        <div className="space-y-12">
          {sections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className="scroll-mt-32"
            >
              <div className="bg-white rounded-2xl shadow-sm border border-rose-100 overflow-hidden">
                {/* Section Header */}
                <div className="bg-gradient-to-r from-rose-100 to-purple-100 px-6 py-4 border-b border-rose-200">
                  <h2 className="text-rose-900 mb-1">{section.content.title}</h2>
                  <p className="text-rose-700">{section.content.summary}</p>
                </div>

                {/* Section Body */}
                <div className="p-6 space-y-6">
                  {/* What it is */}
                  <div>
                    <h3 className="text-gray-900 mb-2">{section.content.whatItIs}</h3>
                    <p className="text-gray-700 leading-relaxed">{section.content.whatItIsBody}</p>
                  </div>

                  {/* Why it matters */}
                  <div>
                    <h3 className="text-gray-900 mb-2">{section.content.whyItMatters}</h3>
                    <p className="text-gray-700 leading-relaxed">{section.content.whyItMattersBody}</p>
                  </div>

                  {/* How it works */}
                  <div>
                    <h3 className="text-gray-900 mb-2">{section.content.howItWorks}</h3>
                    <p className="text-gray-700 leading-relaxed">{section.content.howItWorksBody}</p>
                  </div>

                  {/* Access & limits */}
                  <div className="pt-4 border-t border-rose-100">
                    <h3 className="text-gray-900 mb-2">{section.content.accessLimits}</h3>
                    <p className="text-gray-700 leading-relaxed">{section.content.accessLimitsBody}</p>
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>

        {/* Closing Philosophy */}
        <div className="mt-16 p-8 bg-gradient-to-br from-rose-100 via-purple-100 to-rose-100 rounded-2xl text-center border border-rose-200">
          <p className="text-gray-800 italic max-w-2xl mx-auto">
            "{currentContent.closingPhilosophy}"
          </p>
        </div>
      </div>
    </div>
  );
}
