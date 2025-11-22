/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_842702175")

  // update field
  collection.fields.addAt(9, new Field({
    "hidden": false,
    "id": "select105650625",
    "maxSelect": 1,
    "name": "category",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "select",
    "values": [
      "STARTER",
      "FULL_COURSE",
      "MAIN_COURSE",
      "SIDE_DISH",
      "DESSERT",
      "SAUCE",
      "DRINK",
      "OTHER",
      "UNKNOWN"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_842702175")

  // update field
  collection.fields.addAt(9, new Field({
    "hidden": false,
    "id": "select105650625",
    "maxSelect": 1,
    "name": "category",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "select",
    "values": [
      "STARTER",
      "FULL_COURSE",
      "MAIN_COURSE",
      "SIDE_DISH",
      "DESSERT",
      "SAUCE",
      "DRINK",
      "OTHER"
    ]
  }))

  return app.save(collection)
})
