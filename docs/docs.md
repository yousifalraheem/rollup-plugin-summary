<hr/>

## Options

These are the available options:

| Name      | Type   | Description                                             | Default |
|-----------|--------|---------------------------------------------------------|---------|
| warnLow   | number | Minimum size in bytes to be highlighted in yellow       | 5000    |
| warnHigh  | number | Minimum size in bytes to be highlighted in red          | 10000   |
| totalLow  | number | Minimum total size in bytes to be highlighted in yellow | 200000  |
| totalHigh | number | Minimum total size in bytes to be highlighted in red    | 300000  |

<br/>

Here is an example of how it's used:

```javascript
{
    plugins: [
        summary({ warnLow: 1000, warnHigh: 3000 })
    ]
}
```

<br/>

<small>**Note:** When changing the aforementioned options make sure you pass them in pairs. Changing the `warnLow` will require you to also pass `warnHigh`. Same goes with `totalLow` and `totalHigh`. The reason is if you don't change the `high` value, it will will be prioritized. So raising the `warnLow` value will still result in the value to be highlighted in `red`.</small>
