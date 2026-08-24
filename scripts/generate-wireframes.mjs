import fs from 'fs';
import path from 'path';

const outDir = String.raw`E:\Google Drive\UNINTER\_PROJETO MULTIDISCIPLINAR\assets\wireframes`;

const screens = [
  {
    id: '01-lgpd',
    title: 'Modal LGPD',
    mobile(w, h) {
      return `
  ${modal(w / 2 - 140, h / 2 - 120, 280, 240, 'Privacidade e LGPD')}
  ${label(40, h / 2 - 80, 'Texto explicativo sobre tratamento de dados')}
  ${checkbox(50, h / 2 - 40, 'Autorizo tratamento de dados *')}
  ${checkbox(50, h / 2 - 10, 'Desejo receber ofertas (opcional)')}
  ${button(w / 2 - 80, h / 2 + 60, 160, 'Aceitar e continuar')}`;
    },
    desktop(w, h) {
      return `
  ${modal(w / 2 - 180, 120, 360, 260, 'Privacidade e LGPD')}
  ${label(w / 2 - 150, 170, 'Texto explicativo sobre tratamento de dados')}
  ${checkbox(w / 2 - 150, 210, 'Autorizo tratamento de dados *')}
  ${checkbox(w / 2 - 150, 240, 'Desejo receber ofertas (opcional)')}
  ${button(w / 2 - 80, 320, 160, 'Aceitar e continuar')}`;
    }
  },
  {
    id: '02-login',
    title: 'Entrada',
    mobile(w, h) {
      return `
  ${card(20, 80, w - 40, 360, 'Entrar')}
  ${field(40, 150, w - 80, 'E-mail')}
  ${field(40, 210, w - 80, 'Senha')}
  ${button(40, 280, w - 80, 'Entrar')}
  ${label(40, 340, 'Link: Cadastre-se')}
  ${box(40, 380, w - 80, 50, 'Conta demo')}`;
    },
    desktop(w, h) {
      return `
  ${card(w / 2 - 200, 100, 400, 380, 'Entrar')}
  ${field(w / 2 - 170, 170, 340, 'E-mail')}
  ${field(w / 2 - 170, 230, 340, 'Senha')}
  ${button(w / 2 - 170, 300, 340, 'Entrar')}
  ${label(w / 2 - 170, 360, 'Link: Cadastre-se')}
  ${box(w / 2 - 170, 400, 340, 50, 'Conta demo')}`;
    }
  },
  {
    id: '03-loja',
    title: 'Seleção de loja',
    mobile(w, h) {
      return `
  ${navMobile(w)}
  ${label(20, 70, 'Escolha sua loja')}
  ${label(20, 95, 'Promoções em destaque')}
  ${box(20, 110, w - 40, 60, 'Card promoção')}
  ${box(20, 180, w - 40, 80, 'Recife - Centro')}
  ${box(20, 270, w - 40, 80, 'Recife - Boa Viagem')}
  ${box(20, 360, w - 40, 80, 'Olinda - Histórico')}
  ${button(20, 460, w - 40, 'Ver cardápio')}
  ${bottomNav(w, h)}`;
    },
    desktop(w, h) {
      return `
  ${navDesktop(w, ['Loja', 'Cardápio', 'Carrinho', 'Conta', 'Sair'])}
  ${label(40, 80, 'Escolha sua loja · Promoções em destaque')}
  ${box(40, 100, 280, 70, 'Promoção 1')}
  ${box(340, 100, 280, 70, 'Promoção 2')}
  ${box(40, 190, 280, 100, 'Recife - Centro')}
  ${box(340, 190, 280, 100, 'Recife - Boa Viagem')}
  ${box(640, 190, 280, 100, 'Olinda - Histórico')}
  ${button(40, 320, 200, 'Ver cardápio')}`;
    }
  },
  {
    id: '04-cardapio',
    title: 'Cardápio',
    mobile(w, h) {
      return `
  ${navMobile(w)}
  ${label(20, 70, 'Cardápio · Loja selecionada')}
  ${button(w - 140, 65, 120, 'Trocar loja', true)}
  ${label(20, 110, 'Tapiocas')}
  ${box(20, 125, w - 40, 90, 'Produto + Personalizar')}
  ${label(20, 230, 'Cuscuz')}
  ${box(20, 245, w - 40, 90, 'Produto + Personalizar')}
  ${bottomNav(w, h)}`;
    },
    desktop(w, h) {
      return `
  ${navDesktop(w, ['Loja', 'Cardápio', 'Carrinho', 'Conta', 'Sair'])}
  ${label(40, 80, 'Cardápio · Loja selecionada')}
  ${label(40, 120, 'Tapiocas')}
  ${box(40, 140, 280, 120, 'Produto A')}
  ${box(340, 140, 280, 120, 'Produto B')}
  ${box(640, 140, 280, 120, 'Produto C')}`;
    }
  },
  {
    id: '05-personalizar',
    title: 'Personalização',
    mobile(w, h) {
      return `
  ${overlay(w, h)}
  ${modal(20, 100, w - 40, 420, 'Personalizar produto')}
  ${label(40, 150, 'Tamanho: ( ) P  ( ) M  ( ) G')}
  ${label(40, 190, 'Adicionais: [ ] Queijo  [ ] Ovo')}
  ${field(40, 240, w - 80, 'Quantidade')}
  ${button(40, 460, 120, 'Cancelar', true)}
  ${button(w - 200, 460, 160, 'Adicionar ao carrinho')}`;
    },
    desktop(w, h) {
      return `
  ${overlay(w, h)}
  ${modal(w / 2 - 220, 80, 440, 400, 'Personalizar produto')}
  ${label(w / 2 - 190, 130, 'Tamanho: ( ) P  ( ) M  ( ) G')}
  ${label(w / 2 - 190, 170, 'Adicionais: [ ] Queijo  [ ] Ovo')}
  ${field(w / 2 - 190, 210, 380, 'Quantidade')}
  ${button(w / 2 - 190, 420, 120, 'Cancelar', true)}
  ${button(w / 2 + 70, 420, 180, 'Adicionar ao carrinho')}`;
    }
  },
  {
    id: '06-carrinho',
    title: 'Carrinho',
    mobile(w, h) {
      return `
  ${navMobile(w)}
  ${label(20, 70, 'Carrinho')}
  ${box(20, 100, w - 40, 100, 'Item 1  [- 1 +]  Remover')}
  ${box(20, 210, w - 40, 100, 'Item 2  [- 2 +]  Remover')}
  ${label(20, 340, 'Subtotal: R$ XX,XX')}
  ${button(20, 370, w - 40, 'Continuar comprando', true)}
  ${button(20, 420, w - 40, 'Finalizar pedido')}
  ${bottomNav(w, h)}`;
    },
    desktop(w, h) {
      return `
  ${navDesktop(w, ['Loja', 'Cardápio', 'Carrinho', 'Conta', 'Sair'])}
  ${label(40, 80, 'Carrinho')}
  ${box(40, 110, 700, 80, 'Item 1 · [- 1 +] · Remover')}
  ${box(40, 200, 700, 80, 'Item 2 · [- 2 +] · Remover')}
  ${label(40, 310, 'Subtotal: R$ XX,XX')}
  ${button(500, 340, 240, 'Finalizar pedido')}`;
    }
  },
  {
    id: '07-finalizacao',
    title: 'Finalização do pedido',
    mobile(w, h) {
      return `
  ${navMobile(w)}
  ${label(20, 70, 'Finalização do pedido')}
  ${box(20, 100, w - 40, 140, 'Resumo do pedido')}
  ${box(20, 250, w - 40, 160, 'Fidelidade · Toggle pontos')}
  ${label(20, 430, 'Total: R$ XX,XX')}
  ${button(20, 460, w - 40, 'Pagar')}
  ${bottomNav(w, h)}`;
    },
    desktop(w, h) {
      return `
  ${navDesktop(w, ['Loja', 'Cardápio', 'Carrinho', 'Conta', 'Sair'])}
  ${label(40, 80, 'Finalização do pedido')}
  ${box(40, 110, 460, 260, 'Resumo do pedido')}
  ${box(520, 110, 400, 260, 'Programa de fidelidade · Pagar')}`;
    }
  },
  {
    id: '08-gateway',
    title: 'Gateway externo',
    mobile(w, h) {
      return `
  ${label(20, 40, 'Gateway Externo (sem navbar do app)')}
  ${box(20, 120, w - 40, 320, 'PagSeguro Mock')}
  ${label(40, 180, 'Pedido #XXXXXXXX')}
  ${button(40, 300, w - 80, 'Aprovar pagamento')}
  ${button(40, 360, w - 80, 'Recusar pagamento', true)}`;
    },
    desktop(w, h) {
      return `
  ${label(w / 2 - 120, 40, 'Gateway Externo (sem navbar do app)')}
  ${box(w / 2 - 200, 100, 400, 320, 'PagSeguro Mock')}
  ${label(w / 2 - 170, 160, 'Pedido #XXXXXXXX')}
  ${button(w / 2 - 170, 280, 340, 'Aprovar pagamento')}
  ${button(w / 2 - 170, 340, 340, 'Recusar pagamento', true)}`;
    }
  },
  {
    id: '09-pedido',
    title: 'Acompanhamento',
    mobile(w, h) {
      return `
  ${navMobile(w)}
  ${label(20, 70, 'Acompanhar pedido')}
  ${label(40, 120, '● Recebido')}
  ${label(40, 170, '● Cozinha')}
  ${label(40, 220, '● Pronto para retirada')}
  ${box(20, 280, w - 40, 140, 'Detalhes do pedido')}
  ${bottomNav(w, h)}`;
    },
    desktop(w, h) {
      return `
  ${navDesktop(w, ['Loja', 'Cardápio', 'Carrinho', 'Conta', 'Sair'])}
  ${label(40, 80, 'Acompanhar pedido')}
  ${label(80, 140, 'Recebido — Cozinha — Pronto (horizontal)')}
  ${box(40, 200, 880, 180, 'Detalhes do pedido e total')}`;
    }
  },
  {
    id: '10-conta',
    title: 'Minha conta',
    mobile(w, h) {
      return `
  ${navMobile(w)}
  ${label(20, 70, 'Minha conta')}
  ${box(20, 100, w - 40, 160, 'Nome · E-mail · Pontos')}
  ${box(20, 280, w - 40, 140, 'LGPD · Limpar dados salvos')}
  ${button(40, 360, w - 80, 'Limpar dados salvos', true)}
  ${bottomNav(w, h)}`;
    },
    desktop(w, h) {
      return `
  ${navDesktop(w, ['Loja', 'Cardápio', 'Carrinho', 'Conta', 'Sair'])}
  ${label(40, 80, 'Minha conta')}
  ${box(40, 110, 500, 180, 'Dados do perfil')}
  ${box(40, 310, 500, 160, 'Privacidade LGPD · Limpar dados salvos')}`;
    }
  }
];

function esc(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function box(x, y, w, h, text) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#f5f5f5" stroke="#666" stroke-width="1.5" stroke-dasharray="4 2"/>
<text x="${x + 12}" y="${y + 24}" font-family="Arial,sans-serif" font-size="13" fill="#333">${esc(text)}</text>`;
}

function card(x, y, w, h, text) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#fff" stroke="#333" stroke-width="2"/>
<text x="${x + 16}" y="${y + 28}" font-family="Arial,sans-serif" font-size="16" font-weight="bold" fill="#111">${esc(text)}</text>`;
}

function modal(x, y, w, h, text) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#fff" stroke="#333" stroke-width="2"/>
<text x="${x + 16}" y="${y + 28}" font-family="Arial,sans-serif" font-size="15" font-weight="bold" fill="#111">${esc(text)}</text>`;
}

function field(x, y, w, label) {
  return `<text x="${x}" y="${y - 6}" font-family="Arial,sans-serif" font-size="12" fill="#555">${esc(label)}</text>
<rect x="${x}" y="${y}" width="${w}" height="36" fill="#fff" stroke="#888" stroke-width="1.5"/>`;
}

function button(x, y, w, text, outline = false) {
  const fill = outline ? '#fff' : '#ddd';
  return `<rect x="${x}" y="${y}" width="${w}" height="40" fill="${fill}" stroke="#333" stroke-width="1.5"/>
<text x="${x + w / 2}" y="${y + 25}" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" fill="#111">${esc(text)}</text>`;
}

function label(x, y, text) {
  return `<text x="${x}" y="${y}" font-family="Arial,sans-serif" font-size="12" fill="#444">${esc(text)}</text>`;
}

function checkbox(x, y, text) {
  return `<rect x="${x}" y="${y}" width="16" height="16" fill="#fff" stroke="#666"/>
<text x="${x + 24}" y="${y + 13}" font-family="Arial,sans-serif" font-size="12" fill="#333">${esc(text)}</text>`;
}

function navMobile(w) {
  return `<rect x="0" y="0" width="${w}" height="48" fill="#e0e0e0" stroke="#999"/>
<text x="16" y="30" font-family="Arial,sans-serif" font-size="14" font-weight="bold">Raízes do Nordeste</text>`;
}

function navDesktop(w, items) {
  const links = items.map((item, i) => `<text x="${w - 420 + i * 80}" y="30" font-family="Arial,sans-serif" font-size="12">${esc(item)}</text>`).join('\n');
  return `<rect x="0" y="0" width="${w}" height="48" fill="#e0e0e0" stroke="#999"/>
<text x="24" y="30" font-family="Arial,sans-serif" font-size="14" font-weight="bold">Raízes do Nordeste</text>
${links}`;
}

function bottomNav(w, h) {
  return `<rect x="0" y="${h - 56}" width="${w}" height="56" fill="#ececec" stroke="#999"/>
<text x="${w * 0.17}" y="${h - 20}" text-anchor="middle" font-size="11">Loja</text>
<text x="${w * 0.5}" y="${h - 20}" text-anchor="middle" font-size="11">Cardápio</text>
<text x="${w * 0.5}" y="${h - 38}" text-anchor="middle" font-size="11">Carrinho</text>
<text x="${w * 0.83}" y="${h - 20}" text-anchor="middle" font-size="11">Conta</text>`;
}

function overlay(w, h) {
  return `<rect x="0" y="0" width="${w}" height="${h}" fill="#000" opacity="0.15"/>`;
}

function render(variant, screen) {
  const w = variant === 'mobile' ? 375 : 960;
  const h = variant === 'mobile' ? 640 : 520;
  const body = variant === 'mobile' ? screen.mobile(w, h) : screen.desktop(w, h);
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="100%" height="100%" fill="#fafafa"/>
  <text x="16" y="${h - 12}" font-family="Arial,sans-serif" font-size="11" fill="#888">Wireframe baixa fidelidade · ${esc(screen.title)} · ${variant === 'mobile' ? 'Mobile' : 'Desktop'}</text>
${body}
</svg>`;
}

fs.mkdirSync(outDir, { recursive: true });

for (const screen of screens) {
  for (const variant of ['mobile', 'desktop']) {
    const file = path.join(outDir, `${screen.id}-${variant}.svg`);
    fs.writeFileSync(file, render(variant, screen), 'utf8');
  }
}

console.log(`Generated ${screens.length * 2} wireframes in ${outDir}`);
