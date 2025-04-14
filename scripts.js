
const getList = async () => {
  let url = 'http://127.0.0.1:5000/formacoes';
  fetch(url, { method: 'get' })
    .then((response) => response.json())
    .then((data) => {
      data.formacoes.forEach(item =>
        insertList(item.id, item.nome, item.tipo, item.carga_horaria, item.preco, item.atividade)
      );
    })
    .catch((error) => console.error('Erro:', error));
};

getList();

const postItem = async (inputFormacao, inputTipo, inputCargahoraria, inputPreco, inputAtividade) => {
  const formData = new FormData();
  formData.append('nome', inputFormacao);
  formData.append('tipo', inputTipo);
  formData.append('carga_horaria', inputCargahoraria);
  formData.append('preco', inputPreco);
  formData.append('atividade', inputAtividade);

  let url = 'http://127.0.0.1:5000/formacao';
  fetch(url, {
    method: 'post',
    body: formData
  })
    .then((response) => response.json())
    .then(() => location.reload())
    .catch((error) => console.error('Erro', error));
};

const insertList = (id, nome, tipo, carga_horaria, preco, atividade) => {
  let table = document.getElementById('minhaFormacao');
  let row = table.insertRow();

  const valores = [nome, tipo, carga_horaria, preco, atividade];
  valores.forEach(valor => {
    let celula = row.insertCell();
    celula.textContent = valor;
  });

  // Célula de ações
  let celulaAcoes = row.insertCell();

  const btnDeletar = document.createElement("button");
  btnDeletar.textContent = "Deletar";
  btnDeletar.className = "btn-deletar";
  btnDeletar.onclick = () => deletarItem(nome);
  celulaAcoes.appendChild(btnDeletar);

  const btnEmenta = document.createElement("button");
  btnEmenta.textContent = "Adicionar Ementa";
  btnEmenta.className = "btn-ementa";
  btnEmenta.onclick = () => adicionarEmenta(id);
  celulaAcoes.appendChild(btnEmenta);

  const btnVerEmenta = document.createElement("button");
  btnVerEmenta.textContent = "Ver Ementa";
  btnVerEmenta.className = "btn-ver";
  btnVerEmenta.onclick = () => visualizarEmenta(nome);
  celulaAcoes.appendChild(btnVerEmenta);
};

function deletarItem(nome) {
  const confirmar = confirm("Tem certeza que deseja deletar esta formação?");
  if (!confirmar) return;

  const url = `http://127.0.0.1:5000/formacao?nome=${encodeURIComponent(nome)}`;
  fetch(url, { method: 'DELETE' })
    .then(res => {
      if (res.ok) {
        alert("Formação deletada com sucesso.");
        location.reload();
      } else {
        alert("Erro ao deletar formação.");
      }
    })
    .catch(err => console.error("Erro:", err));
}

// Funções de ementa (placeholders por enquanto)
function adicionarEmenta(id) {
  const texto = prompt("Digite a ementa para esta formação:");

  if (!texto) {
    alert("A ementa não pode estar vazia.");
    return;
  }

  fetch("http://127.0.0.1:5000/ementa", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      formacao_id: id,
      texto: texto
    })
  })
    .then(res => {
      if (res.ok) {
        alert("Ementa adicionada com sucesso!");
      } else {
        alert("Erro ao adicionar ementa.");
      }
    })
    .catch(err => {
      console.error("Erro:", err);
      alert("Erro ao enviar ementa.");
    });
}

function visualizarEmenta(nome) {
  fetch(`http://127.0.0.1:5000/formacao?nome=${encodeURIComponent(nome)}`)
    .then(res => res.json())
    .then(data => {
      if (data.ementa && data.ementa.length > 0) {
        const textos = data.ementa.map(e => e.texto).join("\n\n");
        alert("Ementas:\n\n" + textos);
      } else {
        alert("Esta formação ainda não possui ementas.");
      }
    })
    .catch(err => {
      console.error("Erro ao buscar ementa:", err);
      alert("Erro ao buscar ementa.");
    });
}

//adicionando nova formação
const novaFormacao = () => {
  let inputFormacao = document.getElementById("newInput").value;
  let inputTipo = document.getElementById("newTipo").value;
  let inputCargahoraria = document.getElementById("newTime").value;
  let inputPreco = document.getElementById("newPrice").value;
  let inputAtividade = document.getElementById("newStatus").value;

  if (inputFormacao === '') {
    alert("Dê o nome para uma formação!!");
  } else if (isNaN(inputCargahoraria) || isNaN(inputPreco)) {
    alert("Carga horária e preço só podem ser números!");
  } else if (inputAtividade === '' || inputTipo === '') {
    alert("Você precisa escolher uma opção para a atividade e o tipo da formação");
  } else {
    postItem(inputFormacao, inputTipo, inputCargahoraria, inputPreco, inputAtividade);
  }
};
