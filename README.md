### Utilities for dealing with Rust like unions in Typescript
This may or may not be a very good idea but it saves me development time and I can't be bothered to care.
#### Pitfall
The generalised `match` function doesn't enforce exhaustive coverage of all possible variants and allows 
for multiple entries covering the same branch. Probably could've just used serde's [tagging rules](https://serde.rs/enum-representations.html#adjacently-tagged) instead
but its too late now.
