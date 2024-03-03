import fitz  # Importa a biblioteca PyMuPDF

def extrair_paginas(arquivo_origem, arquivo_destino, num_paginas):
    doc = fitz.open(arquivo_origem)  # Abre o arquivo PDF original
    doc_saida = fitz.open()  # Cria um novo documento PDF em memória
    
    for pagina in range(num_paginas):  # Loop pelas primeiras 12 páginas
        doc_saida.insert_pdf(doc, from_page=pagina, to_page=pagina)  # Insere cada página no novo documento
    
    doc_saida.save(arquivo_destino)  # Salva o novo documento PDF
    doc_saida.close()  # Fecha o documento em memória
    doc.close()  # Fecha o documento original

# Usando a função para extrair as primeiras 12 páginas
extrair_paginas('Pengo.pdf', 'novo_arquivo.pdf', 12)
