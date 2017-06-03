module RockPaperScissors.SignPost exposing (main)


import Html
import Html.Attributes as Attribute


main: Program Never Model Message
main =
    Html.program
    {
      init = ({ gameId = "123456" }, Cmd.none)
    , update = update
    , view = view
    , subscriptions = subscriptions
    }


type alias Model =
    {
        gameId: String
    }


type Message =
      DoNothing
    | Update String


update : Message -> Model -> (Model, Cmd Message)
update msg model =
    case msg of
        DoNothing -> (model, Cmd.none)

        Update gameId -> ({ model | gameId = gameId }, Cmd.none)


view : Model -> Html.Html Message
view model =
    let
        header = "Game " ++ model.gameId
        href = "/join?gameId=" ++ model.gameId
    in
        Html.div
            [ Attribute.class "jumbotron" ]
            [
              Html.h1 [] [ Html.text header ]
            , Html.div [] []
            , Html.a[ Attribute.href href ] [ Html.text href ]
            ]


subscriptions : Model -> Sub Message
subscriptions _ = Sub.none
