/* Everything on phd.html. Edit this file to keep the PhD page current:
   - add a line at the top of `log` whenever something happens (newest first; a date can be "2026-10" or just "2026")
   - move `packages[].done` when the annual report updates the progress ranges
   - add papers and talks to `outputs` (status: published, accepted, review, preprint, talk)
   Text fields take { es, en }. */
window.PHD = {
  updated: "2026-10-29",

  project: {
    acronym: "PROST-AID",
    title: {
      es: "Análisis multimodal con inteligencia artificial para detectar y caracterizar el cáncer de próstata clínicamente significativo, integrando imagen, datos clínicos y radiómica",
      en: "AI-based multimodal analysis for detecting and characterising clinically significant prostate cancer, integrating imaging, clinical data and radiomics"
    },
    lede: {
      es: "Una herramienta de IA que ayuda a radiólogos y urólogos a decidir qué tumores de próstata necesitan tratamiento, combinando la resonancia con los datos clínicos del paciente y explicando por qué decide lo que decide.",
      en: "An AI tool that helps radiologists and urologists decide which prostate tumours need treatment, combining MRI with the patient's clinical data and explaining why it reaches each answer."
    }
  },

  facts: [
    { label: { es: "Programa", en: "Programme" }, value: { es: "Doctorado en Tecnologías para la Salud y el Bienestar, Universitat Politècnica de València", en: "PhD in Health and Well-being Technologies, Universitat Politècnica de València" } },
    { label: { es: "Centro", en: "Host centre" }, value: { es: "Unidad Mixta de Imagen Biomédica e IA FISABIO-CIPF, Valencia", en: "FISABIO-CIPF Joint Unit for Biomedical Imaging and AI, Valencia" } },
    { label: { es: "Dirección", en: "Supervisor" }, value: { es: "Dra. María de la Iglesia Vayá", en: "Dr María de la Iglesia Vayá" } },
    { label: { es: "Financiación", en: "Funding" }, value: { es: "Ayuda Predoctoral AECC Valencia 2025, de octubre de 2025 a octubre de 2028", en: "AECC Valencia 2025 Predoctoral Grant, October 2025 to October 2028" } },
    { label: { es: "Inicio", en: "Started" }, value: { es: "Octubre de 2024", en: "October 2024" } }
  ],

  status: {
    range: [21, 40],
    text: {
      es: "Primera anualidad de la ayuda completada. Hay modelos publicados y validados en varios centros; ahora toca la integración multimodal, los hábitats tumorales y la validación con datos locales.",
      en: "First grant year completed. Models are published and validated across centres; next come multimodal integration, tumour habitats and validation on local data."
    }
  },

  why: [
    { title: { es: "El problema", en: "The problem" },
      text: { es: "El cáncer de próstata es el segundo más diagnosticado en hombres. La resonancia ayuda a encontrarlo, pero leerla es difícil incluso para especialistas: dos radiólogos pueden ver cosas distintas en la misma imagen, y eso lleva a biopsias que no hacían falta o a tumores que se escapan.",
            en: "Prostate cancer is the second most diagnosed cancer in men. MRI helps find it, but reading it is hard even for specialists: two radiologists can see different things in the same scan, which leads to unnecessary biopsies or missed tumours." } },
    { title: { es: "La idea", en: "The idea" },
      text: { es: "Un médico no decide solo con la imagen: mira el PSA, el volumen de la próstata, la historia del paciente. El modelo hace lo mismo. Combina las secuencias de resonancia con esos datos clínicos y con medidas cuantitativas del tejido.",
            en: "A doctor doesn't decide from the image alone: they look at PSA, prostate volume and the patient's history. The model does the same. It combines the MRI sequences with that clinical data and with quantitative measurements of the tissue." } },
    { title: { es: "Por qué importa", en: "Why it matters" },
      text: { es: "Un segundo lector fiable y que explica su respuesta puede reducir biopsias innecesarias, dar el mismo nivel de lectura en hospitales distintos y ayudar a personalizar el tratamiento según lo agresivo que sea cada tumor.",
            en: "A reliable second reader that explains its answer can cut unnecessary biopsies, give the same quality of reading across hospitals and help tailor treatment to how aggressive each tumour is." } }
  ],

  pipeline: [
    { title: { es: "Datos", en: "Data" },
      items: { es: ["Resonancia: T2W, DWI, ADC y DCE", "Clínicos: PSA, volumen, edad, historia"], en: ["MRI: T2W, DWI, ADC and DCE", "Clinical: PSA, volume, age, history"] } },
    { title: { es: "Modelos", en: "Models" },
      items: { es: ["Deep learning 3D y transformers", "Radiómica y hábitats tumorales"], en: ["3D deep learning and transformers", "Radiomics and tumour habitats"] } },
    { title: { es: "Explicación", en: "Explanation" },
      items: { es: ["Mapas de oclusión y saliencia", "Qué medidas pesan en cada caso"], en: ["Occlusion and saliency maps", "Which measurements drive each case"] } },
    { title: { es: "Apoyo clínico", en: "Clinical support" },
      items: { es: ["Probabilidad de cáncer significativo", "Segundo lector para radiología y urología"], en: ["Probability of significant cancer", "Second reader for radiology and urology"] } }
  ],

  objectives: [
    { es: "Reunir y curar bases de datos de imagen con segmentaciones hechas por expertos.", en: "Collect and curate imaging datasets with expert segmentations." },
    { es: "Construir un marco de IA que combine imagen, radiómica y datos clínicos para detectar, clasificar y estratificar el riesgo del cáncer clínicamente significativo.", en: "Build an AI framework that combines imaging, radiomics and clinical data to detect, classify and risk-stratify clinically significant cancer." },
    { es: "Estudiar la heterogeneidad dentro del tumor (hábitats) para predecir su agresividad y personalizar el tratamiento.", en: "Study heterogeneity inside the tumour (habitats) to predict aggressiveness and personalise treatment." },
    { es: "Hacer los modelos interpretables, para que el médico pueda comprobar por qué deciden lo que deciden.", en: "Make the models interpretable, so clinicians can check why they decide what they decide." },
    { es: "Evaluar los aspectos éticos y validar los modelos según la normativa y las buenas prácticas clínicas.", en: "Assess the ethical aspects and validate the models against regulation and clinical best practice." }
  ],

  data: [
    { value: "8,000+", label: { es: "pacientes en BIMCV-Prostate", en: "patients in BIMCV-Prostate" },
      text: { es: "Banco de Imagen Médica de la Comunidad Valenciana, de 16 departamentos de salud.", en: "Valencian Region Medical Imaging Bank, from 16 health departments." } },
    { value: "1,500", label: { es: "casos de PI-CAI", en: "PI-CAI cases" },
      text: { es: "Conjunto público internacional, con y sin cáncer significativo.", en: "International public dataset, with and without significant cancer." } },
    { value: "16", label: { es: "centros en la validación multicéntrica", en: "centres in multi-centre validation" },
      text: { es: "4,700 sesiones de resonancia para medir si el modelo aguanta el cambio de hospital.", en: "4,700 MRI sessions to measure whether the model survives a change of hospital." } }
  ],

  results: [
    { metric: "0.816", unit: "AUC",
      title: { es: "Detección multicéntrica", en: "Multi-centre detection" },
      text: { es: "Modelo de deep learning entrenado con PI-CAI y BIMCV-Prostate y evaluado en un conjunto independiente. Transfer learning y un ensamble de modelos mejoran la generalización frente al modelo base.", en: "Deep learning model trained on PI-CAI and BIMCV-Prostate and tested on an independent set. Transfer learning and a model ensemble generalise better than the baseline." },
      source: { es: "Scientific Reports, 2026", en: "Scientific Reports, 2026" }, doi: "10.1038/s41598-026-42214-7" },
    { metric: "88%", unit: { es: "concordancia", en: "agreement" },
      title: { es: "Explicaciones que señalan la lesión", en: "Explanations that point to the lesion" },
      text: { es: "En 110 de 125 sesiones anotadas por urólogos, los mapas de explicación del modelo coincidieron con la lesión real, sin haber entrenado al modelo para localizarla.", en: "In 110 of 125 sessions annotated by urologists, the model's explanation maps matched the real lesion, without the model being trained to locate it." },
      source: { es: "Congreso Nacional de Urología, Madrid, 2026", en: "Spanish National Urology Congress, Madrid, 2026" } },
    { metric: "ADC", unit: { es: "sintético", en: "synthetic" },
      title: { es: "Aprovechar estudios incompletos", en: "Using incomplete studies" },
      text: { es: "Cuando a un paciente le falta una secuencia, sintetizarla permite incluirlo sin perder capacidad de generalización. En datos reales eso significa no descartar pacientes.", en: "When a patient is missing a sequence, synthesising it lets them stay in without hurting generalisation. With real-world data that means not discarding patients." },
      source: { es: "Scientific Reports, 2026", en: "Scientific Reports, 2026" }, doi: "10.1038/s41598-026-42214-7" },
    { metric: "0.839", unit: "Dice",
      title: { es: "De 3T a 7T en Berna", en: "From 3T to 7T in Bern" },
      text: { es: "Durante la estancia en el ARTORG Center, modelos con atención redujeron el ruido de 4D Flow MRI acercando adquisiciones de 3T a una referencia de 7T. Las mismas técnicas sirven para armonizar imágenes de distintos escáneres.", en: "During the ARTORG Center stay, attention-based models denoised 4D Flow MRI, bringing 3T acquisitions closer to a 7T reference. The same techniques help harmonise images from different scanners." },
      source: { es: "CMBE 2026, Kobe", en: "CMBE 2026, Kobe" } }
  ],

  /* Progress from the annual AECC report, as the reported range [from, to] in percent. */
  packages: [
    { id: "PT1", title: { es: "Revisión sistemática y selección de datos", en: "Systematic review and data selection" }, done: [81, 100] },
    { id: "PT2", title: { es: "Recogida y preprocesamiento de datos", en: "Data collection and preprocessing" }, done: [61, 80] },
    { id: "PT3", title: { es: "Desarrollo de modelos de IA", en: "AI model development" }, done: [41, 60] },
    { id: "PT4", title: { es: "Entrenamiento y validación", en: "Training and validation" }, done: [41, 60] },
    { id: "PT5", title: { es: "Análisis de hábitats tumorales", en: "Tumour habitat analysis" }, done: [0, 20] },
    { id: "PT6", title: { es: "Integración y viabilidad clínica", en: "Clinical integration and feasibility" }, done: [0, 20] },
    { id: "PT7", title: { es: "Difusión y redacción de la tesis", en: "Dissemination and thesis writing" }, done: [21, 40] }
  ],

  next: [
    { es: "Validar con la cohorte local completa, ya con el dictamen favorable del Comité de Ética.", en: "Validate on the full local cohort, now that the Ethics Committee has approved the project." },
    { es: "Probar modelos fundacionales tabulares para unir radiómica y variables clínicas.", en: "Test tabular foundation models to combine radiomics and clinical variables." },
    { es: "Medir la transportabilidad entre centros y la calibración, dejando un centro fuera cada vez.", en: "Measure transportability and calibration across centres, leaving one centre out at a time." },
    { es: "Aplicar la armonización y la super-resolución de Berna para estabilizar la radiómica.", en: "Apply the harmonisation and super-resolution from Bern to stabilise radiomics." },
    { es: "Llevar la interpretabilidad al análisis multimodal y a los hábitats tumorales.", en: "Extend interpretability to multimodal analysis and tumour habitats." }
  ],

  log: [
    { date: "2026-10", title: { es: "Informe de la primera anualidad", en: "First-year report" }, text: { es: "Avance global del 21 al 40 %, sin desviaciones críticas.", en: "Overall progress of 21 to 40%, no critical deviations." } },
    { date: "2026-07", title: { es: "Artículo enviado a Insights into Imaging", en: "Paper submitted to Insights into Imaging" }, text: { es: "Radiómica de la glándula completa y biomarcadores clínicos, evaluados en varios centros con modelos clásicos, profundos y tabulares preentrenados.", en: "Whole-gland radiomics and clinical biomarkers, evaluated across centres with classical, deep and pretrained tabular models." } },
    { date: "2026-06", title: { es: "CMBE 2026 en Kobe", en: "CMBE 2026 in Kobe" }, text: { es: "Comunicación como coprimer autor sobre 4D Flow MRI de 3T a 7T.", en: "Co-first-author talk on 4D Flow MRI from 3T to 7T." } },
    { date: "2026", title: { es: "Congreso Nacional de Urología, Madrid", en: "Spanish National Urology Congress, Madrid" }, text: { es: "Interpretabilidad de la IA en resonancia prostática validada frente a urólogos.", en: "AI interpretability on prostate MRI validated against urologists." } },
    { date: "2026-04", title: { es: "Fin de la estancia en Berna", en: "End of the Bern stay" }, text: { es: "Pipelines de registro 3T/7T, segmentación vascular, reducción de ruido y super-resolución.", en: "Pipelines for 3T/7T registration, vessel segmentation, denoising and super-resolution." } },
    { date: "2026", title: { es: "Publicado en Scientific Reports", en: "Published in Scientific Reports" }, text: { es: "Detección del cáncer clínicamente significativo con deep learning en un estudio multicéntrico.", en: "Detection of clinically significant cancer with deep learning in a multi-centre study." } },
    { date: "2026-01", title: { es: "Estancia en el ARTORG Center, Berna", en: "Research stay at the ARTORG Center, Bern" }, text: { es: "Tres meses en el Cardiovascular Engineering Group de la Universidad de Berna.", en: "Three months with the Cardiovascular Engineering Group, University of Bern." } },
    { date: "2025-10", title: { es: "Arranca la ayuda AECC y JBI 2025", en: "AECC grant starts, and JBI 2025" }, text: { es: "Inicio de la financiación el 15 de octubre. Comunicación en Madrid: radiómica frente a deep learning para clasificar la gravedad del tumor.", en: "Funding starts on 15 October. Talk in Madrid: radiomics versus deep learning to classify tumour severity." } },
    { date: "2025-05", title: { es: "Concesión de la Ayuda Predoctoral AECC", en: "AECC Predoctoral Grant awarded" }, text: { es: "Asociación Española Contra el Cáncer, convocatoria Valencia 2025.", en: "Spanish Association Against Cancer, Valencia 2025 call." } },
    { date: "2025-03", title: { es: "Dos comunicaciones en el EAU 2025", en: "Two talks at EAU 2025" }, text: { es: "Detección multicéntrica y efecto de las variables clínicas en la precisión del modelo, en Madrid.", en: "Multi-centre detection and the effect of clinical variables on model accuracy, in Madrid." } },
    { date: "2024-10", title: { es: "Admisión en el doctorado", en: "Admitted to the PhD programme" }, text: { es: "Programa de Doctorado en Tecnologías para la Salud y el Bienestar de la UPV.", en: "UPV PhD programme in Health and Well-being Technologies." } }
  ],

  outputs: [
    { status: "published", year: 2026, title: "Clinically significant prostate cancer detection with deep learning in a multi-center magnetic resonance imaging study", venue: "Scientific Reports", doi: "10.1038/s41598-026-42214-7" },
    { status: "accepted", year: 2026, title: "Multimodal Artificial Intelligence for Prostate Cancer Diagnosis and Risk Stratification: A Scoping Review", venue: "Journal of Medical Internet Research", doi: "10.2196/105912" },
    { status: "review", year: 2026, title: "Whole-Gland Biparametric MRI Radiomics and Clinical Biomarkers for Clinically Significant Prostate Cancer Detection: Multicentre Evaluation of Classical, Deep and Pretrained Tabular Models", venue: "Insights into Imaging" },
    { status: "preprint", year: 2026, title: "From Data Fusion to Decision Support in Prostate Cancer: Evidence Mapping of Multimodal Artificial Intelligence", venue: "Research Square", doi: "10.21203/rs.3.rs-9883038/v1" },
    { status: "talk", year: 2026, title: "From 3T to 7T: supervised learning for enhanced 4D flow MRI in intracranial aneurysms", venue: "CMBE 2026, Kobe" },
    { status: "talk", year: 2026, title: "Interpretabilidad en IA aplicada a mpMRI prostática: validación de mapas explicativos para apoyar la lectura clínica", venue: { es: "Congreso Nacional de Urología, Madrid", en: "Spanish National Urology Congress, Madrid" } },
    { status: "talk", year: 2025, title: "Radiomics versus Deep Learning MRI Classification of Prostate Cancer Severity", venue: "JBI 2025, Madrid" },
    { status: "talk", year: 2025, title: "Clinically significant prostate cancer detection with deep learning in a multi-center magnetic resonance imaging study", venue: "EAU 2025, Madrid", doi: "10.1016/j.eururo.2025.09.4115" },
    { status: "talk", year: 2025, title: "Influence of clinical variables on the accuracy of an artificial intelligence model for prostate cancer diagnosis", venue: "EAU 2025, Madrid", doi: "10.1016/j.eururo.2025.09.2924" },
    { status: "dataset", year: 2024, title: "BIMCV-Prostate-Dataset V1", venue: "Zenodo" },
    { status: "published", year: 2023, title: "SAM-UNETR: Clinically Significant Prostate Cancer Segmentation Using Transfer Learning From Large Model", venue: "IEEE Access", doi: "10.1109/access.2023.3326882" }
  ],

  glossary: [
    { term: { es: "Cáncer clínicamente significativo (csPCa)", en: "Clinically significant cancer (csPCa)" },
      def: { es: "Un tumor de próstata con suficiente agresividad como para necesitar tratamiento. En la práctica, ISUP 2 o superior. Muchos tumores de próstata crecen tan despacio que basta con vigilarlos; distinguir unos de otros es el centro de la tesis.", en: "A prostate tumour aggressive enough to need treatment, in practice ISUP grade 2 or higher. Many prostate tumours grow so slowly that monitoring is enough; telling the two apart is the core of the thesis." } },
    { term: { es: "ISUP y Gleason", en: "ISUP and Gleason" },
      def: { es: "Escalas con las que el patólogo gradúa la agresividad del tumor a partir de la biopsia. ISUP va de 1 (poco agresivo) a 5 (muy agresivo).", en: "Scales a pathologist uses to grade tumour aggressiveness from the biopsy. ISUP runs from 1 (low) to 5 (very aggressive)." } },
    { term: { es: "Resonancia multiparamétrica (mpMRI)", en: "Multiparametric MRI (mpMRI)" },
      def: { es: "Una resonancia de próstata que combina varias secuencias, cada una sensible a una propiedad distinta del tejido. Juntas dan una imagen mucho más completa que cualquiera por separado.", en: "A prostate MRI that combines several sequences, each sensitive to a different tissue property. Together they show far more than any one alone." } },
    { term: { es: "T2W, DWI, ADC y DCE", en: "T2W, DWI, ADC and DCE" },
      def: { es: "Las secuencias de la mpMRI. T2W muestra la anatomía; DWI mide cómo se mueve el agua en el tejido (los tumores la frenan); ADC es el mapa numérico que sale de la DWI; DCE muestra cómo entra un contraste en los vasos.", en: "The mpMRI sequences. T2W shows anatomy; DWI measures how water moves in tissue (tumours slow it down); ADC is the numeric map derived from DWI; DCE shows how contrast flows into the vessels." } },
    { term: { es: "PI-RADS", en: "PI-RADS" },
      def: { es: "La escala del 1 al 5 con la que el radiólogo puntúa la sospecha de cáncer en una resonancia de próstata. Es subjetiva, y por eso varía entre lectores.", en: "The 1 to 5 scale radiologists use to score suspicion of cancer on prostate MRI. It is subjective, so it varies between readers." } },
    { term: { es: "PSA", en: "PSA" },
      def: { es: "Antígeno prostático específico: una proteína que se mide en sangre. Un valor alto puede indicar cáncer, pero también otras cosas, así que se interpreta junto al volumen de la próstata y la imagen.", en: "Prostate-specific antigen, a protein measured in blood. A high value can mean cancer but also other things, so it is read together with prostate volume and imaging." } },
    { term: { es: "Radiómica", en: "Radiomics" },
      def: { es: "Convertir la imagen en cientos de números que describen intensidad, textura y forma del tejido. Son medidas que el ojo no cuantifica y que un modelo sencillo puede usar y explicar.", en: "Turning an image into hundreds of numbers that describe tissue intensity, texture and shape. These are measurements the eye can't quantify and that a simple model can use and explain." } },
    { term: { es: "Hábitats tumorales", en: "Tumour habitats" },
      def: { es: "Un tumor no es uniforme: tiene zonas con más células, más vasos o menos oxígeno. Agrupar esas subregiones ayuda a predecir lo agresivo que es y cómo responderá al tratamiento.", en: "A tumour isn't uniform: some areas have more cells, more vessels or less oxygen. Grouping those subregions helps predict how aggressive it is and how it will respond to treatment." } },
    { term: { es: "Deep learning", en: "Deep learning" },
      def: { es: "Redes neuronales que aprenden directamente de las imágenes qué patrones importan, sin que nadie les diga qué medir. En la tesis se usan redes 3D y transformers.", en: "Neural networks that learn which patterns matter directly from images, without being told what to measure. The thesis uses 3D networks and transformers." } },
    { term: { es: "Transfer learning y ensamble", en: "Transfer learning and ensembles" },
      def: { es: "Transfer learning es partir de un modelo ya entrenado en otra tarea y ajustarlo a la nuestra. Un ensamble combina varios modelos y suele acertar más que cualquiera de ellos solo.", en: "Transfer learning starts from a model trained on another task and adapts it to ours. An ensemble combines several models and is usually more accurate than any single one." } },
    { term: { es: "Segmentación (nnU-Net)", en: "Segmentation (nnU-Net)" },
      def: { es: "Delimitar automáticamente la próstata o la lesión en la imagen. nnU-Net es una red de referencia que se configura sola para cada conjunto de datos.", en: "Automatically outlining the prostate or the lesion in the image. nnU-Net is a reference network that configures itself for each dataset." } },
    { term: { es: "AUC", en: "AUC" },
      def: { es: "Una medida de 0.5 a 1 de lo bien que un modelo separa enfermos de sanos. 0.5 es tirar una moneda; 1 es perfecto. Por encima de 0.8 se considera bueno en este problema.", en: "A score from 0.5 to 1 of how well a model separates sick from healthy. 0.5 is a coin toss; 1 is perfect. Above 0.8 is considered good for this problem." } },
    { term: { es: "Validación multicéntrica y hold-out", en: "Multi-centre validation and hold-out" },
      def: { es: "Probar el modelo con pacientes que nunca vio al entrenarse (hold-out), y mejor aún de otros hospitales. Es la prueba de que funciona fuera del laboratorio.", en: "Testing the model on patients it never saw during training (hold-out), ideally from other hospitals. It is the evidence that it works outside the lab." } },
    { term: { es: "Interpretabilidad", en: "Interpretability" },
      def: { es: "Técnicas que muestran en qué se fija el modelo. La oclusión tapa partes de la imagen y mide cuánto cambia la respuesta; la saliencia resalta los píxeles que más pesan.", en: "Techniques that show what the model is looking at. Occlusion covers parts of the image and measures how much the answer changes; saliency highlights the pixels that matter most." } },
    { term: { es: "BIMCV y PI-CAI", en: "BIMCV and PI-CAI" },
      def: { es: "Las dos fuentes de datos. BIMCV es el Banco de Imagen Médica de la Comunidad Valenciana; PI-CAI es un reto internacional abierto con resonancias de próstata anotadas.", en: "The two data sources. BIMCV is the Valencian Region Medical Imaging Bank; PI-CAI is an open international challenge with annotated prostate MRI." } },
    { term: { es: "Super-resolución y 4D Flow MRI", en: "Super-resolution and 4D Flow MRI" },
      def: { es: "La 4D Flow MRI mide cómo fluye la sangre en el tiempo. La super-resolución usa IA para recuperar detalle que la adquisición no capturó, como si la imagen viniera de un escáner más potente.", en: "4D Flow MRI measures how blood flows over time. Super-resolution uses AI to recover detail the acquisition missed, as if the image came from a stronger scanner." } }
  ]
};
