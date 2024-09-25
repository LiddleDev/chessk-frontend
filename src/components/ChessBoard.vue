<script setup>
import {ref, watch} from "vue";

const props = defineProps({
  gameState: Object,
  squares: Array,
  isMostRecent: Boolean,
  whiteAtBottom: Boolean,
})

watch(() => props.isMostRecent, (newValue, oldValue) => {
  selectedRow.value = null;
  selectedColumn.value = null;
});

const emit = defineEmits(["makeMove"]);

const selectedRow = ref(null)
const selectedColumn = ref(null)

function selectSquare(row, col) {
  if (!props.isMostRecent) {
    return
  }

  if (selectedRow.value === row && selectedColumn.value === col) {
    selectedRow.value = null
    selectedColumn.value = null
    return
  }

  const side = props.gameState.squares[row][col].side
  const playerSide = props.gameState.playingSide

  if (selectedRow.value === null) {
    if (side === playerSide) {
      selectedRow.value = row;
      selectedColumn.value = col;
    }
    return
  }

  if (side === playerSide) { // Switching to move another piece
    selectedRow.value = row;
    selectedColumn.value = col;
    return
  }

  // Otherwise we are trying to move or take an opponents piece...
  emit('makeMove', selectedRow.value, selectedColumn.value, row, col)
  selectedRow.value = null
  selectedColumn.value = null
}

</script>

<template>
  <div>
    <div class="board flex flex-col" :class="{'flex-col-reverse': whiteAtBottom}">
      <div class="flex" :class="{'flex-row-reverse': !whiteAtBottom}" v-for="(row, ri) in squares ?? []">
        <div
            class="square white grow"
            :style="{backgroundImage: (column.piece && column.side) ? 'url(\'/'+column.side.toLowerCase()+'_'+column.piece.toLowerCase()+'.svg' : 'none'}"
            :class="{
              'black': (ri + ci) % 2 === 0,
              'selected': selectedRow === ri && selectedColumn === ci,
              'highlighted': isMostRecent && gameState.playingSide === gameState.currentSide && gameState.highlightSquare && gameState.highlightSquare.first === ri && gameState.highlightSquare.second === ci,
            }"
            v-for="(column, ci) in row"
            @click="selectSquare(ri, ci)"
        >
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.board {
  aspect-ratio: 1 / 1;
  max-height: 80vh;
  cursor: pointer;
  user-select: none;
}
.square {
  background-color: red;
  aspect-ratio: 1 / 1;
  background-size: contain;
}

.square.white {
  background-color: #e5d4b5;
}

.square.black {
  background-color: #706755;
}

.square.selected {
  background-color: #945f5f !important;
}

.square.highlighted {
  background-color: #768da8 !important;
}
</style>