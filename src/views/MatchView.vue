<script setup>
import {useUserStore} from "@/stores/user.js";
import {useRoute} from "vue-router";
import axios from "axios";
import {computed, onUnmounted, ref} from "vue";
import ChessBoard from "@/components/ChessBoard.vue";
import router from "@/router/index.js";

const route = useRoute();
const userStore = useUserStore();

axios.get('http://18.132.181.26:8080/matches/'+route.params.code)
  .then(res => {
  })
  .catch(err => {
    router.push('/')
  })

const ws = new WebSocket('ws://18.132.181.26:8080/ws');

onUnmounted(() => {
  ws.close()
})

const gameState = ref({
  started: false,
  whiteTimeRemaining: null,
  blackTimeRemaining: null,
  currentSide: "WHITE",
  playingSide: "WHITE",
  whitePlayer: null,
  blackPlayer: null,
  whiteCastleRights: true,
  blackCastleRights: true,
  squares: [[{"piece":"ROOK","side":"WHITE"},{"piece":"KNIGHT","side":"WHITE"},{"piece":"BISHOP","side":"WHITE"},{"piece":"QUEEN","side":"WHITE"},{"piece":"KING","side":"WHITE"},{"piece":"BISHOP","side":"WHITE"},{"piece":"KNIGHT","side":"WHITE"},{"piece":"ROOK","side":"WHITE"}],[{"piece":"PAWN","side":"WHITE"},{"piece":"PAWN","side":"WHITE"},{"piece":"PAWN","side":"WHITE"},{"piece":"PAWN","side":"WHITE"},{"piece":"PAWN","side":"WHITE"},{"piece":"PAWN","side":"WHITE"},{"piece":"PAWN","side":"WHITE"},{"piece":"PAWN","side":"WHITE"}],[{"piece":null,"side":null},{"piece":null,"side":null},{"piece":null,"side":null},{"piece":null,"side":null},{"piece":null,"side":null},{"piece":null,"side":null},{"piece":null,"side":null},{"piece":null,"side":null}],[{"piece":null,"side":null},{"piece":null,"side":null},{"piece":null,"side":null},{"piece":null,"side":null},{"piece":null,"side":null},{"piece":null,"side":null},{"piece":null,"side":null},{"piece":null,"side":null}],[{"piece":null,"side":null},{"piece":null,"side":null},{"piece":null,"side":null},{"piece":null,"side":null},{"piece":null,"side":null},{"piece":null,"side":null},{"piece":null,"side":null},{"piece":null,"side":null}],[{"piece":null,"side":null},{"piece":null,"side":null},{"piece":null,"side":null},{"piece":null,"side":null},{"piece":null,"side":null},{"piece":null,"side":null},{"piece":null,"side":null},{"piece":null,"side":null}],[{"piece":"PAWN","side":"BLACK"},{"piece":"PAWN","side":"BLACK"},{"piece":"PAWN","side":"BLACK"},{"piece":"PAWN","side":"BLACK"},{"piece":"PAWN","side":"BLACK"},{"piece":"PAWN","side":"BLACK"},{"piece":"PAWN","side":"BLACK"},{"piece":"PAWN","side":"BLACK"}],[{"piece":"ROOK","side":"BLACK"},{"piece":"KNIGHT","side":"BLACK"},{"piece":"BISHOP","side":"BLACK"},{"piece":"QUEEN","side":"BLACK"},{"piece":"KING","side":"BLACK"},{"piece":"BISHOP","side":"BLACK"},{"piece":"KNIGHT","side":"BLACK"},{"piece":"ROOK","side":"BLACK"}]],
})

const whiteAtBottom = computed(() => {
  return (gameState.value.playingSide ?? "WHITE") === "WHITE"
})

ws.onmessage = (event) => {
  console.log(event.data)
  gameState.value = {...gameState.value, ...JSON.parse(event.data)};
};

ws.onopen = (event) => {
  ws.send(route.params.code + '#join#' + JSON.stringify({
    side: 'WHITE',
    name: userStore.name,
    session: userStore.session,
  }));
}

function makeMove(startRow, startColumn, endRow, endColumn) {
  const payload = {
    sr: startRow,
    sc: startColumn,
    er: endRow,
    ec: endColumn,
  }

  ws.send(route.params.code+'#move#'+JSON.stringify(payload));
}

</script>

<template>
  <div class="match py-4 grid grid-cols-12 gap-8">
    <div class="col-span-8">
      <ChessBoard :game-state="gameState" :white-at-bottom="whiteAtBottom" @make-move="makeMove" />
    </div>
    <div class="col-span-4 flex flex-col" :class="{'flex-col-reverse': whiteAtBottom}">
      <div :class="{'text-3xl': gameState.currentSide === 'WHITE'}">
        <div v-if="gameState.winner === 'WHITE'" class="text-green-600 font-bold">WINNER</div>
        <div>
          {{ gameState.whitePlayer }}
          <span v-if="gameState.playingSide === 'WHITE'">(You)</span>
        </div>
        <div>{{ Math.floor(gameState.whiteTimeRemaining / 60).toString().padStart(2, '0') }}:{{ (gameState.whiteTimeRemaining % 60).toString().padStart(2, '0') }}</div>
      </div>
      <div class="grow"></div>
      <div :class="{'text-3xl': gameState.currentSide === 'BLACK'}">
        <div v-if="gameState.winner === 'BLACK'" class="text-green-600 font-bold">WINNER</div>
        <div>
          {{ gameState.blackPlayer }}
          <span v-if="gameState.playingSide === 'BLACK'">(You)</span>
        </div>
        <div>{{ Math.floor(gameState.blackTimeRemaining / 60).toString().padStart(2, '0') }}:{{ (gameState.blackTimeRemaining % 60).toString().padStart(2, '0') }}</div>
      </div>
    </div>
  </div>
</template>
