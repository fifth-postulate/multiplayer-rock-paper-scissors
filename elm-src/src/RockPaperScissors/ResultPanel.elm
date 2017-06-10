port module RockPaperScissors.ResultPanel exposing (main)


import Html
import Html.Attributes as Attribute


main : Program Flags Model Message
main =
    Html.programWithFlags
        {
         init = init
        , update = update
        , view = view
        , subscriptions = subscriptions
        }


init : Flags -> (Model, Cmd Message)
init flag =
    ({
      gameId = flag.gameId
    , playerId = flag.playerId
    , choice = flag.choice
    , message = Nothing
    , nextGameId = Nothing
    }, Cmd.none)


type alias Flags =
    {
      gameId : String
    , playerId : String
    , choice : String
    }


type alias Model =
    {
      gameId: String
    , playerId: String
    , choice: String
    , message: Maybe String
    , nextGameId: Maybe String
    }


type Message =
      DoNothing
    | UpdateMessage String
    | UpdateNextGameId String


update : Message -> Model -> (Model, Cmd Message)
update message model =
    case message of
        DoNothing ->
            (model, Cmd.none)

        UpdateMessage message ->
            ({ model | message = Just message }, Cmd.none )

        UpdateNextGameId gameId ->
            ({ model | nextGameId = Just gameId }, Cmd.none )


view : Model -> Html.Html Message
view model =
    let
        message =
            case model.message of
                Just m -> m

                Nothing -> "You just played " ++ model.choice
    in
        Html.div [ Attribute.class "jumbotron" ]
            [
             Html.h1 [] [ Html.text message ]
            ]


port message : (String -> msg) -> Sub msg
port gameId : (String -> msg) -> Sub msg


subscriptions : Model -> Sub Message
subscriptions _ =
    Sub.batch
        [
          message UpdateMessage
        , gameId UpdateNextGameId
        ]
