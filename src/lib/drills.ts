// ═══ ACE Drill Data Model ═══
// All drills with cinematic names, rules, and game-situation focus

export type DrillMode = "competitive" | "cooperative";

export type DrillCategory =
    | "serve_plus_one"
    | "return_plus_one"
    | "cross_then_change"
    | "short_ball_finish"
    | "defense_to_neutral"
    | "pressure_point";

export interface Drill {
    id: string;
    title: string;
    emoji: string;
    mode: DrillMode;
    category: DrillCategory;
    focus: string;
    shortDescription: string;
    durationMinutes: number;
    difficulty: 1 | 2 | 3 | 4 | 5;
    rules: string[];
    victoryCondition: string;
    bonusPoints: number;
    targetZones?: string[];
    lore: string;
    shareCopyTemplates: {
        winner: string;
        loser: string;
    };
    caricaturePrompt?: string;
    equipmentSuggestion?: string;
}

// ═══ COMPETITIVE DRILLS ═══
const competitiveDrills: Drill[] = [
    {
        id: "sniper-do-saque",
        title: "O Sniper do Saque",
        emoji: "⚡",
        mode: "competitive",
        category: "serve_plus_one",
        focus: "Saque Direcionado + Ataque",
        shortDescription: "Saque preciso + ataque mortal. Sem piedade.",
        durationMinutes: 10,
        difficulty: 3,
        rules: [
            "Saque direcionado para zona T ou Wide (declare antes)",
            "Segunda bola DEVE ser ataque pós-saque",
            "Ponto só vale se seguir o padrão declarado",
            "Vence quem completar 15 pontos primeiro",
        ],
        victoryCondition: "Primeiro a 15 pontos",
        bonusPoints: 2,
        targetZones: ["T", "Wide"],
        lore: "Todo grande jogador tem um saque que o adversário sabe que vem, mas não consegue devolver. Aqui você treina exatamente isso.",
        shareCopyTemplates: {
            winner: "🔫 [NAME] acabou de snipear o saque e destruiu! ⚡ Missão O Sniper do Saque concluída!",
            loser: "💀 [NAME] tomou uns saques que nem viu a bola passar. Snipado total!",
        },
        caricaturePrompt: "3D cartoon tennis player as a military sniper, hitting a serve with laser precision, neon green trail on ball, dark court background",
        equipmentSuggestion: "tennis_balls",
    },
    {
        id: "rei-do-winner",
        title: "Rei do Winner",
        emoji: "👑",
        mode: "competitive",
        category: "pressure_point",
        focus: "Agressividade",
        shortDescription: "Winner limpo vale x3. Saia da zona de conforto.",
        durationMinutes: 15,
        difficulty: 4,
        rules: [
            "Jogo normal até 11 pontos",
            "Winner limpo (bola não tocada) vale TRIPLO (x3)",
            "Rally normal, ponto normal vale 1",
            "Erro não forçado desconta 1 ponto",
        ],
        victoryCondition: "Primeiro a 11 pontos",
        bonusPoints: 2,
        targetZones: ["3A", "4B"],
        lore: "Pare de ser o cara que fica passando bola. O Rei ataca. O Rei finaliza. O Rei manda winner.",
        shareCopyTemplates: {
            winner: "👑 [NAME] foi coroado o REI DO WINNER! Mandou bola que ninguém tocou!",
            loser: "😰 [NAME] tentou rallyar contra o rei... não deu. A coroa ficou com o rival!",
        },
        caricaturePrompt: "3D cartoon tennis player sitting on golden throne wearing crown, holding tennis racket like scepter, neon green court",
        equipmentSuggestion: "racket_grips",
    },
    {
        id: "tie-break-da-morte",
        title: "Tie-Break da Morte",
        emoji: "💀",
        mode: "competitive",
        category: "pressure_point",
        focus: "Pressão Extrema",
        shortDescription: "Começa no 4×4. Pressão total desde o início.",
        durationMinutes: 8,
        difficulty: 5,
        rules: [
            "Placar começa no 4×4 automaticamente",
            "Quem ganhar 3 pontos primeiro vence",
            "Saque alterna a cada ponto",
            "Cada ponto pode ser o último",
        ],
        victoryCondition: "Primeiro a ganhar 3 pontos a partir do 4×4",
        bonusPoints: 3,
        lore: "Sem aquecimento. Sem margem de erro. Você entra já na beira do abismo. Um escorregão e acabou.",
        shareCopyTemplates: {
            winner: "💀 [NAME] sobreviveu ao TIE-BREAK DA MORTE! Sangue frio total!",
            loser: "⚰️ [NAME] não aguentou a pressão do Tie-Break da Morte. R.I.P.",
        },
        caricaturePrompt: "3D cartoon gladiator tennis player in dark arena, skull motif on racket, dramatic lighting",
        equipmentSuggestion: "wristbands",
    },
    {
        id: "guerra-de-trincheira",
        title: "Guerra de Trincheira",
        emoji: "⚔️",
        mode: "competitive",
        category: "short_ball_finish",
        focus: "Slice / Drop Shot / Toque",
        shortDescription: "Proibido bater reta. Só slice e deixadinha.",
        durationMinutes: 12,
        difficulty: 3,
        rules: [
            "PROIBIDO bater bola reta (topspin)",
            "Só vale slice, drop shot e deixadinha",
            "Topspin = ponto perdido automaticamente",
            "Primeiro a 11 pontos vence",
        ],
        victoryCondition: "Primeiro a 11 pontos (só slice/drop)",
        bonusPoints: 2,
        lore: "Aqui não tem porrada. Aqui é cirurgia. O cara que tem mão vale mais que o cara que tem braço.",
        shareCopyTemplates: {
            winner: "⚔️ [NAME] venceu a GUERRA DE TRINCHEIRA! Toque de cirurgião!",
            loser: "🪦 [NAME] caiu na trincheira tentando bater reta... proibido né amigo 😂",
        },
        caricaturePrompt: "3D cartoon tennis player in military trench, hitting delicate slice shot, comedic style",
        equipmentSuggestion: "tennis_balls",
    },
    {
        id: "impostor",
        title: "Impostor",
        emoji: "🎭",
        mode: "competitive",
        category: "defense_to_neutral",
        focus: "Versatilidade Forçada",
        shortDescription: "Muda de estilo a cada 3 pontos. Adapte-se ou morra.",
        durationMinutes: 15,
        difficulty: 4,
        rules: [
            "A cada 3 pontos, MUDA o estilo obrigatório",
            "Ciclo: Agressivo → Defensivo → All-Court",
            "Juiz (3° jogador ou acordo) fiscaliza",
            "Jogar fora do estilo = ponto perdido",
            "Primeiro a 15 pontos vence",
        ],
        victoryCondition: "Primeiro a 15 pontos",
        bonusPoints: 2,
        lore: "O jogador completo não tem um estilo. Ele tem TODOS. Aqui você prova que sabe ser tudo.",
        shareCopyTemplates: {
            winner: "🎭 [NAME] mostrou que é IMPOSTOR nível mestre! Dominou todos os estilos!",
            loser: "😵 [NAME] bugou trocando de estilo no IMPOSTOR! Confusão total na quadra!",
        },
        equipmentSuggestion: "racket_grips",
    },
    {
        id: "everest",
        title: "Everest",
        emoji: "🏔️",
        mode: "competitive",
        category: "pressure_point",
        focus: "Resistência Mental",
        shortDescription: "Sets curtos, melhor de 5. Quem aguenta?",
        durationMinutes: 25,
        difficulty: 5,
        rules: [
            "Sets curtos: primeiro a 4 games cada",
            "Melhor de 5 sets para vencer",
            "Sem tie-break: vantagem obrigatória",
            "Troca de lado a cada 2 games",
        ],
        victoryCondition: "Melhor de 5 sets (primeiro a 4 games)",
        bonusPoints: 3,
        lore: "A escalada mais longa do tênis amador. Não é sobre quem joga melhor — é sobre quem não desiste.",
        shareCopyTemplates: {
            winner: "🏔️ [NAME] escalou o EVEREST! 5 sets de pura resistência mental!",
            loser: "🥶 [NAME] congelou na subida do Everest. A montanha venceu!",
        },
        equipmentSuggestion: "sports_drinks",
    },
    {
        id: "caca-ao-tesouro",
        title: "Caça ao Tesouro",
        emoji: "🎯",
        mode: "competitive",
        category: "cross_then_change",
        focus: "Mudança de Direção",
        shortDescription: "3 zonas valem x2. Muda a cada minuto.",
        durationMinutes: 10,
        difficulty: 3,
        rules: [
            "3 zonas da quadra são marcadas como 'tesouro' (valem x2)",
            "As zonas mudam a cada 1 minuto (cronômetro)",
            "Acertar zona tesouro = 2 pontos, resto = 1 ponto",
            "Quem somar mais pontos em 10 min ganha",
        ],
        victoryCondition: "Mais pontos em 10 minutos",
        bonusPoints: 2,
        targetZones: ["3A", "4B", "2C"],
        lore: "O mapa muda, mas o pirata de verdade sempre acha o tesouro. Olho na zona, raquete no alvo.",
        shareCopyTemplates: {
            winner: "🎯 [NAME] achou todos os tesouros na CAÇA AO TESOURO! Pontaria absurda!",
            loser: "🗺️ [NAME] se perdeu procurando o tesouro... caçador cego 😂",
        },
        equipmentSuggestion: "training_cones",
    },
    {
        id: "devolucao-mortal",
        title: "Devolução Mortal",
        emoji: "🔫",
        mode: "competitive",
        category: "return_plus_one",
        focus: "Retorno Agressivo",
        shortDescription: "Devolveu? Tem que atacar! Passividade = ponto perdido.",
        durationMinutes: 12,
        difficulty: 4,
        rules: [
            "Sacador saca normalmente",
            "Quem devolve TEM que atacar na devolução",
            "Devolução passiva (bola alta e sem direção) = ponto perdido",
            "Primeiro a 11 pontos vence",
        ],
        victoryCondition: "Primeiro a 11 pontos",
        bonusPoints: 2,
        lore: "A melhor defesa é o ataque. Se vai devolver, devolve com vontade de matar a jogada.",
        shareCopyTemplates: {
            winner: "🔫 [NAME] devolveu tudo com intenção assassina! DEVOLUÇÃO MORTAL ativada!",
            loser: "😵 [NAME] devolveu bola morta e pagou o preço na Devolução Mortal!",
        },
        equipmentSuggestion: "tennis_balls",
    },
    {
        id: "muro-de-berlim",
        title: "Muro de Berlim",
        emoji: "🧱",
        mode: "competitive",
        category: "defense_to_neutral",
        focus: "Defesa → Contra-ataque",
        shortDescription: "Um ataca, outro defende. Troca a cada 5 pontos.",
        durationMinutes: 15,
        difficulty: 4,
        rules: [
            "Jogador A só pode atacar, Jogador B só pode defender",
            "Troca de papéis a cada 5 pontos",
            "Defensor ganha ponto se sobreviver rally de 10+ bolas",
            "Quem pontua mais na defesa ganha (pra valorizar o muro)",
        ],
        victoryCondition: "Mais pontos no papel de defensor",
        bonusPoints: 2,
        lore: "O Muro não cai. O Muro devolve tudo. Seja o Muro que seu adversário não consegue derrubar.",
        shareCopyTemplates: {
            winner: "🧱 [NAME] construiu o MURO DE BERLIM! Nada passou!",
            loser: "💥 [NAME] não conseguiu derrubar o muro. O Muro venceu!",
        },
        equipmentSuggestion: "tennis_shoes",
    },
    {
        id: "roleta-russa",
        title: "Roleta Russa",
        emoji: "🎰",
        mode: "competitive",
        category: "pressure_point",
        focus: "Adaptação Constante",
        shortDescription: "Sorteio antes de cada ponto define as regras.",
        durationMinutes: 12,
        difficulty: 4,
        rules: [
            "Antes de cada ponto, sorteia-se uma restrição",
            "Opções: 'só forehand', 'só backhand', 'só voleio', 'jogo livre'",
            "Usar golpe proibido = ponto perdido",
            "Primeiro a 11 pontos vence",
        ],
        victoryCondition: "Primeiro a 11 pontos",
        bonusPoints: 2,
        lore: "Você nunca sabe qual arma vai ter. O jogador completo sobrevive com qualquer uma.",
        shareCopyTemplates: {
            winner: "🎰 [NAME] sobreviveu à ROLETA RUSSA! Adaptação de mestre!",
            loser: "💀 [NAME] puxou o gatilho errado na Roleta Russa! Bang!",
        },
        equipmentSuggestion: "racket_grips",
    },
    {
        id: "robin-hood",
        title: "Robin Hood",
        emoji: "🏹",
        mode: "competitive",
        category: "cross_then_change",
        focus: "Precisão Angular",
        shortDescription: "Acerte os 2 cantos opostos na mesma jogada = x3.",
        durationMinutes: 12,
        difficulty: 3,
        rules: [
            "Jogo normal, pontos normais valem 1",
            "Se a bola picar nos 2 cantos OPOSTOS na mesma jogada, vale x3",
            "Precisa tocar canto direito E esquerdo no mesmo rally",
            "Primeiro a 15 pontos vence",
        ],
        victoryCondition: "Primeiro a 15 pontos",
        bonusPoints: 2,
        lore: "Robin Hood roubava dos ricos e dava pros pobres. Você vai roubar os cantos e dar pro placar.",
        shareCopyTemplates: {
            winner: "🏹 [NAME] acertou todos os alvos como ROBIN HOOD! Artilheiro dos cantos!",
            loser: "🎯 [NAME] atirou no canto e acertou a rede. Robin Hood fake!",
        },
        equipmentSuggestion: "training_cones",
    },
    {
        id: "relogio-de-ouro",
        title: "Relógio de Ouro",
        emoji: "⏱️",
        mode: "competitive",
        category: "serve_plus_one",
        focus: "Velocidade Decisiva",
        shortDescription: "Cada ponto tem 15s de rally. Acabou o tempo? Ponto anulado.",
        durationMinutes: 10,
        difficulty: 3,
        rules: [
            "Cada rally tem no MÁXIMO 15 segundos",
            "Se passar de 15s, ponto anulado e repete",
            "Proíbe ficar rallyando infinito — tem que decidir rápido",
            "Primeiro a 11 pontos vence",
        ],
        victoryCondition: "Primeiro a 11 pontos (rallies de ≤15s)",
        bonusPoints: 2,
        lore: "O relógio tá correndo. Vai ficar trocando bola ou vai resolver a jogada?",
        shareCopyTemplates: {
            winner: "⏱️ [NAME] bateu o RELÓGIO DE OURO! Decisão rápida e mortal!",
            loser: "⌛ [NAME] ficou esperando e o tempo acabou! Tick-tock, perdeu!",
        },
        equipmentSuggestion: "sports_watch",
    },
    {
        id: "coringa",
        title: "Coringa",
        emoji: "🃏",
        mode: "competitive",
        category: "pressure_point",
        focus: "Blefe / Estratégia",
        shortDescription: "3 coringas por set: declare x3 antes de sacar. Blefe total.",
        durationMinutes: 15,
        difficulty: 4,
        rules: [
            "Cada jogador tem 3 'coringas' por set",
            "Pode declarar antes de sacar que o próximo ponto vale x3",
            "O rival não sabe se é blefe ou não",
            "Usar todos os coringas é obrigatório até o final",
            "Primeiro a 21 pontos vence",
        ],
        victoryCondition: "Primeiro a 21 pontos",
        bonusPoints: 2,
        lore: "Poker de raquete. Você sabe jogar, mas sabe blefar? O Coringa domina a mente do adversário.",
        shareCopyTemplates: {
            winner: "🃏 [NAME] jogou o CORINGA no momento perfeito! Blefe que virou ouro!",
            loser: "🎴 [NAME] caiu no blefe do Coringa! A carta virou contra!",
        },
        equipmentSuggestion: "racket_grips",
    },
    {
        id: "a-cobra",
        title: "A Cobra",
        emoji: "🐍",
        mode: "competitive",
        category: "short_ball_finish",
        focus: "Jogo Curto",
        shortDescription: "Primeiro toque no T obrigatório. Bola longa = ponto perdido.",
        durationMinutes: 10,
        difficulty: 3,
        rules: [
            "Primeiro toque após o saque DEVE cair na área de saque (T)",
            "Bola longa (passa da linha de saque) = ponto perdido",
            "Força drop shots, ângulos curtos e bola com efeito",
            "Primeiro a 11 pontos vence",
        ],
        victoryCondition: "Primeiro a 11 pontos",
        bonusPoints: 2,
        lore: "A cobra não precisa de altura. Ela ataca de baixo, rente ao chão. Jogo curto é jogo inteligente.",
        shareCopyTemplates: {
            winner: "🐍 [NAME] atacou como A COBRA! Tudo rente ao chão, tudo mortal!",
            loser: "🐍 [NAME] tentou bater forte e a Cobra engoliu. Bola curta venceu!",
        },
        equipmentSuggestion: "tennis_balls",
    },
];

// ═══ COOPERATIVE DRILLS ═══
const cooperativeDrills: Drill[] = [
    {
        id: "defesa-do-castelo",
        title: "Defesa do Castelo",
        emoji: "🛡️",
        mode: "cooperative",
        category: "defense_to_neutral",
        focus: "Profundidade",
        shortDescription: "A área de saque é lava. 30 bolas após a linha de saque.",
        durationMinutes: 8,
        difficulty: 2,
        rules: [
            "A área de saque de vocês é 'lava' — proibido a bola cair ali",
            "A dupla precisa trocar 30 bolas SEGUIDAS após a linha de saque",
            "Se a bola cair na área de saque, contagem ZERA",
            "Objetivo: manter profundidade consistente",
        ],
        victoryCondition: "30 bolas seguidas após a linha de saque",
        bonusPoints: 4,
        lore: "O castelo de vocês está sob ataque. A muralha é a linha de saque. Nada pode cair dentro do território.",
        shareCopyTemplates: {
            winner: "🛡️ A dupla DEFENDEU O CASTELO! 30 bolas profundas seguidas! Muralha inabalável!",
            loser: "🏰 O castelo caiu... A dupla não conseguiu manter a profundidade!",
        },
        equipmentSuggestion: "tennis_balls",
    },
    {
        id: "operacao-sniper",
        title: "Operação Sniper",
        emoji: "🎯",
        mode: "cooperative",
        category: "cross_then_change",
        focus: "Direção / Precisão",
        shortDescription: "5 bolas seguidas no corredor em 3 min. Errou a 4ª? Zera.",
        durationMinutes: 5,
        difficulty: 3,
        rules: [
            "Objetivo: acertar 5 bolas SEGUIDAS no corredor (alley)",
            "Tempo limite: 3 minutos",
            "Se errar a 4ª bola, contagem ZERA",
            "A pressão psicológica simula Game Point",
        ],
        victoryCondition: "5 bolas seguidas no corredor em 3 minutos",
        bonusPoints: 4,
        lore: "Precisão cirúrgica. Um centímetro pra fora e a missão fracassa. Respira fundo, mira o alvo.",
        shareCopyTemplates: {
            winner: "🎯 OPERAÇÃO SNIPER concluída! 5 tiros no corredor sem erro!",
            loser: "💨 Operação Sniper falhou... O corredor ficou vazio!",
        },
        equipmentSuggestion: "training_cones",
    },
    {
        id: "metronomo",
        title: "Metrônomo",
        emoji: "🔄",
        mode: "cooperative",
        category: "defense_to_neutral",
        focus: "Consistência / Ritmo",
        shortDescription: "50 bolas seguidas sem erro. Ritmo constante.",
        durationMinutes: 10,
        difficulty: 2,
        rules: [
            "A dupla precisa trocar 50 bolas SEGUIDAS",
            "Velocidade constante — sem acelerar nem desacelerar",
            "Qualquer erro zera a contagem",
            "Foco: ritmo > potência",
        ],
        victoryCondition: "50 bolas seguidas em ritmo constante",
        bonusPoints: 4,
        lore: "O pêndulo não para. O metrônomo não erra. Sejam a máquina que nunca falha.",
        shareCopyTemplates: {
            winner: "🔄 METRÔNOMO ativado! 50 bolas PERFEITAS sem parar!",
            loser: "💔 O Metrônomo desafinou... A dupla errou antes de chegar na meta!",
        },
        equipmentSuggestion: "tennis_balls",
    },
    {
        id: "furacao-cruzado",
        title: "Furacão Cruzado",
        emoji: "🌪️",
        mode: "cooperative",
        category: "cross_then_change",
        focus: "Cruzado Consistente",
        shortDescription: "Todas as bolas cruzadas. 40 trocas sem erro.",
        durationMinutes: 8,
        difficulty: 3,
        rules: [
            "TODAS as bolas devem ser cruzadas (cross-court)",
            "Uma paralela = RESET da contagem",
            "Meta: 40 trocas sem erro",
            "Pode alternar forehand e backhand cross",
        ],
        victoryCondition: "40 bolas cruzadas seguidas",
        bonusPoints: 4,
        lore: "O cross-court é a base de 70% dos pontos do tênis mundial. Domine o cruzado, domine o jogo.",
        shareCopyTemplates: {
            winner: "🌪️ FURACÃO CRUZADO! 40 bolas cruzadas PERFEITAS! Nível ATP!",
            loser: "💨 O Furacão perdeu força... Uma paralela escapou e zerou tudo!",
        },
        equipmentSuggestion: "tennis_balls",
    },
    {
        id: "espelho",
        title: "Espelho",
        emoji: "🪞",
        mode: "cooperative",
        category: "return_plus_one",
        focus: "Imitação / Controle",
        shortDescription: "Um lidera, outro copia o golpe exato. 20 sequências.",
        durationMinutes: 10,
        difficulty: 3,
        rules: [
            "Jogador A é o 'líder' — ele escolhe o golpe",
            "Jogador B é o 'espelho' — copia o mesmo golpe e direção",
            "Ex: Forehand cruzado → responde com forehand cruzado",
            "Meta: 20 sequências espelhadas perfeitas",
        ],
        victoryCondition: "20 sequências espelhadas sem erro",
        bonusPoints: 4,
        lore: "Seja o reflexo perfeito. Quando a dupla se sincroniza, o tênis vira dança.",
        shareCopyTemplates: {
            winner: "🪞 ESPELHO perfeito! 20 sequências sincronizadas! Os caras são gêmeos!",
            loser: "🪞 O espelho quebrou... A dupla não conseguiu sincronizar!",
        },
        equipmentSuggestion: "tennis_balls",
    },
    {
        id: "sinfonia",
        title: "Sinfonia",
        emoji: "🎵",
        mode: "cooperative",
        category: "serve_plus_one",
        focus: "Padrão Tático Completo",
        shortDescription: "Sequência declarada: saque → devolução → approach → voleio.",
        durationMinutes: 12,
        difficulty: 4,
        rules: [
            "Sequência declarada: Saque T → Devolução cruzada → Approach → Voleio",
            "Cada etapa deve ser executada EXATAMENTE como declarada",
            "Se errar qualquer etapa, reinicia a sequência",
            "Meta: completar o padrão 10x",
        ],
        victoryCondition: "10 sequências táticas completas",
        bonusPoints: 5,
        lore: "O jogador de elite não joga pontos aleatórios. Ele joga sinfonias. Cada golpe é uma nota perfeita.",
        shareCopyTemplates: {
            winner: "🎵 SINFONIA completa! 10 padrões táticos PERFEITOS! Maestros da quadra!",
            loser: "🎵 A Sinfonia desafinou... A dupla não completou o padrão!",
        },
        equipmentSuggestion: "tennis_balls",
    },
    {
        id: "escalada",
        title: "Escalada",
        emoji: "🧗",
        mode: "cooperative",
        category: "defense_to_neutral",
        focus: "Progressão de Dificuldade",
        shortDescription: "Começa com 5 bolas seguidas. Cada sucesso aumenta +5.",
        durationMinutes: 15,
        difficulty: 2,
        rules: [
            "Nível 1: trocar 5 bolas seguidas",
            "Nível 2: trocar 10 bolas seguidas",
            "Cada nível concluído sobe +5 bolas",
            "Errou? Volta pro nível anterior. Até onde a dupla escala?",
        ],
        victoryCondition: "Alcançar o nível mais alto possível",
        bonusPoints: 4,
        lore: "A montanha não tem topo. Cada nível é mais difícil. Quanto mais alto, mais vale a escalada.",
        shareCopyTemplates: {
            winner: "🧗 ESCALADA nível [LEVEL]! A dupla subiu [TOTAL] degraus sem cair!",
            loser: "🧗 A Escalada parou no nível [LEVEL]... Dá pra subir mais!",
        },
        equipmentSuggestion: "tennis_balls",
    },
    {
        id: "circo",
        title: "Circo",
        emoji: "🎪",
        mode: "cooperative",
        category: "short_ball_finish",
        focus: "Toque Criativo",
        shortDescription: "Só vale bola com efeito. Chapada não conta!",
        durationMinutes: 10,
        difficulty: 3,
        rules: [
            "Só vale bola com efeito: slice, drop, lob, smash, topspin pesado",
            "Bola 'chapada' (sem efeito) NÃO conta",
            "Meta: 30 toques criativos seguidos",
            "Quanto mais criativo o golpe, melhor!",
        ],
        victoryCondition: "30 toques criativos seguidos",
        bonusPoints: 4,
        lore: "Bem-vindo ao Circo! Aqui não tem golpe boring. Só mágica, pirueta e efeito.",
        shareCopyTemplates: {
            winner: "🎪 BEM-VINDO AO CIRCO! 30 toques criativos! Malabaristas da raquete!",
            loser: "🎪 O show do Circo parou... Alguém bateu bola normal 😂",
        },
        equipmentSuggestion: "tennis_balls",
    },
];

// ═══ EXPORTS ═══
export const ALL_DRILLS: Drill[] = [...competitiveDrills, ...cooperativeDrills];

export const getDrillById = (id: string): Drill | undefined =>
    ALL_DRILLS.find((d) => d.id === id);

export const getDrillsByMode = (mode: DrillMode): Drill[] =>
    ALL_DRILLS.filter((d) => d.mode === mode);

export const getDrillsByCategory = (category: DrillCategory): Drill[] =>
    ALL_DRILLS.filter((d) => d.category === category);

export const getRandomDrill = (mode?: DrillMode): Drill => {
    const pool = mode ? getDrillsByMode(mode) : ALL_DRILLS;
    return pool[Math.floor(Math.random() * pool.length)];
};

// Drill of the Week — rotates based on current week number
export const getDrillOfTheWeek = (): Drill => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const weekNumber = Math.ceil(
        ((now.getTime() - start.getTime()) / 86400000 + start.getDay() + 1) / 7
    );
    return ALL_DRILLS[weekNumber % ALL_DRILLS.length];
};
