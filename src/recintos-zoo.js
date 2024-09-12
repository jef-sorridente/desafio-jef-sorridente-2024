import { animais } from "./animais";
import { recintos } from "./recintos";

class RecintosZoo {
  analisaRecintos(animal, quantidade) {
    //Verifica se o animla existe no array de objetos animais
    const animalValido = animais.find((ani) => ani.especie === animal);

    //Se o animal não for válido retorna o erro
    if (!animalValido) {
      return { erro: "Animal inválido" };
    }

    //Se a quantidade for menor ou igual a zero retorna o erro
    if (quantidade <= 0) {
      return { erro: "Quantidade inválida" };
    }
    if (animalValido) {
      //Faz o calculo do peso de animais já existentes no recinto
      function calcula(recinto) {
        let soma = 0;
        recinto.animaisExistentes.forEach((a) => {
          soma += a.tamanho;

          if (a.especie != animalValido.especie) {
            soma += 1;
          }
        });
        return soma;
      }
      //Pega o tamanho total do recinto e diminui pelo tamanho do animal x a quantidade - animais que já existem no recinto
      let espacoRecinto = 0;
      recintos.filter((recinto) => {
        espacoRecinto =
          recinto.tamanhoTotal -
          animalValido.tamanho * quantidade -
          calcula(recinto, animalValido);
      });

      //Se o espaço do recinto for maior que 0 retorna o erro
      if (espacoRecinto < 0) {
        return {
          erro: "Não há recinto viável",
        };
      }

      //Filtra recintos com biomas viaveis para o animal
      const recintosViaveis = recintos.filter((recinto) =>
        recinto.bioma.some((bioma) => animalValido.bioma.includes(bioma))
      );

      //Filtra recintos que possuim animais com a alimentação herbivoro + onivoro + vazio
      const verificaAnimaisHerbOvo = recintosViaveis.filter(
        (a) =>
          a.animaisExistentes.length === 0 ||
          a.animaisExistentes.some((a) => a.alimentacao === "herbivoro") ||
          a.animaisExistentes.some((a) => a.alimentacao === "onivoro")
      );

      //Filtra recintos que possuim animais com a alimentação carnivoros + vazio
      const animalCarnivoro = recintosViaveis.filter(
        (a) =>
          a.animaisExistentes.length === 0 ||
          a.animaisExistentes.some((a) => a.alimentacao === "carnivoro")
      );

      //Verifica se o animal o recinto tem animais, se for diferente de hipopotamos verifica se o bioma é savana + rio
      const verificaHipopotamo = verificaAnimaisHerbOvo.filter(
        (a) =>
          a.animaisExistentes.length === 0 ||
          (a.animaisExistentes.some((a) => a.especie != "HIPOPOTAMO") &&
            a.bioma.includes("savana") &&
            a.bioma.includes("rio"))
      );

      //Verifica se o macaco está sozinho
      const verificaMacaco = verificaAnimaisHerbOvo.filter(
        (a) => a.animaisExistentes.length > 0
      );

      if (
        animalValido.especie === "MACACO" &&
        quantidade === 1 &&
        verificaMacaco
      ) {
        return {
          erro: "O macaco não pode ficar sozinho",
        };
      }

      //Se o animla for o hipopotamo retorna os recintos validos
      if (animalValido.especie === "HIPOPOTAMO") {
        return {
          recintosViaveis: verificaHipopotamo.map((recinto) => {
            return `Recinto ${recinto.numero} (espaço livre: ${
              recinto.tamanhoTotal -
              animalValido.tamanho * quantidade -
              calcula(recinto, animalValido)
            } total: ${recinto.tamanhoTotal})`;
          }),
        };
      }

      //Se o animal for herbivoro ou onivoro retorna os recintos disponíveis
      if (
        animalValido.alimentacao === "herbivoro" ||
        animalValido.alimentacao === "onivoro"
      ) {
        return {
          recintosViaveis: verificaAnimaisHerbOvo.map((recinto) => {
            return `Recinto ${recinto.numero} (espaço livre: ${
              recinto.tamanhoTotal -
              animalValido.tamanho * quantidade -
              calcula(recinto, animalValido)
            } total: ${recinto.tamanhoTotal})`;
          }),
        };
      }

      //Se o animal for carnivoro retorna os recintos disponíveis
      if (animalValido.alimentacao === "carnivoro") {
        return {
          recintosViaveis: animalCarnivoro.map((recinto) => {
            return `Recinto ${recinto.numero} (espaço livre: ${
              recinto.tamanhoTotal -
              animalValido.tamanho * quantidade -
              calcula(recinto)
            } total: ${recinto.tamanhoTotal})`;
          }),
        };
      }
    }
  }
}

export { RecintosZoo as RecintosZoo };
