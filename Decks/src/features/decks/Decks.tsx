import { DecksList } from './DecksList/DecksList.tsx'
import { AddNewDeckForm } from './AddNewDeckForm/AddNewDeckForm.tsx'

export const Decks = () => {
  return (
    <div>
      <h1>Decks 🐈</h1>
      <AddNewDeckForm />
      <DecksList />
      <footer>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aperiam autem beatae, consequuntur deserunt
        esse fugit hic incidunt labore libero nobis obcaecati optio quia reiciendis reprehenderit rerum vel, vitae
        voluptatibus.
      </footer>
    </div>
  )
}