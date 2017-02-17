import React, { Component } from 'react'
import { connect } from 'react-redux'
// import axios from 'axios'
import { Grid, Menu, Segment } from 'semantic-ui-react'
import AddLiquorAddIns from './addLiquorAddIns'
import AddBeers from './addBeers'
import AddCocktails from './addCocktails'

import { actions } from './duck.Drinks'

@connect(store => ({
  currentAddView: store.drinks.currentAddView,
  beers: store.drinks.menuBeers,
  cocktails: store.drinks.menuCocktails,
  liquors: store.drinks.menuLiquors,
  addIns: store.drinks.menuAddIns,
}))
class Drinks extends Component {
  componentWillMount() {
    // axios
    //   .get(drinksEndpoint)
    //   .then(response => {
    //     const beers = []
    //     const cocktails = []
    //     const liquors = []

    //     const drinksObj = { beers, cocktails, liquors }

    //     response.forEach(drinkObj => {
    //       const temp = {
    //         name: drinkObj.name,
    //         price: (drinkObj.price / 100).toFixed(2),
    //       }
    //       if (drinkObj.type === 'cocktail') {
    //         cocktails.push(temp)
    //       } else if (drinkObj.type === 'shot') {
    //         liquors.push(temp)
    //       } else if (drinkObj.type === 'beer') {
    //         beers.push(temp)
    //       }
    //     })
    //     this.props.dispatch(actions.getDrinks(drinksObj))
    //   })
    //   .catch(err => {
    //     console.log(err)
    //   })
  }

  toggleMenu(menuName) {
    this.props.dispatch(actions.toggleMenu(menuName))
  }

  render() {
    const addView = this.props.currentAddView
    let renderedView = <AddLiquorAddIns />

    if (addView === 'liquorAddIns') {
      renderedView = <AddLiquorAddIns liquors={this.props.liquors} addIns={this.props.addIns} />
    } else if (addView === 'beers') {
      renderedView = <AddBeers beers={this.props.beers} />
    } else if (addView === 'cocktails') {
      renderedView = <AddCocktails cocktails={this.props.cocktails} />
    }

    return (
      <Grid>
        <Grid.Column width={4}>
          <Menu fluid vertical tabular>
            <Menu.Item name="beers" active={addView === 'beers'} onClick={() => this.toggleMenu('beers')} />
            <Menu.Item name="liquorAddIns" active={addView === 'liquorAddIns'} onClick={() => this.toggleMenu('liquorAddIns')} />
            <Menu.Item name="cocktails" active={addView === 'cocktails'} onClick={() => this.toggleMenu('cocktails')} />
          </Menu>
        </Grid.Column>

        <Grid.Column stretched width={12}>
          <Segment>
            {renderedView}
          </Segment>
        </Grid.Column>
      </Grid>
    )
  }
}

export default Drinks
