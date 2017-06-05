module RockPaperScissors.AdminPanel exposing (main)


import Html
import Html.Events as Event


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
    (emptyModel flag.gameId, Cmd.none)


type alias Flags =
    { gameId: String }


type alias Model =
    {
      history: List GameInfo
    , current: GameInfo
    }


type alias GameInfo =
    {
      gameId: GameId
    , registeredPlayers: Int
    , choicesMade: Int
    }


type alias GameId = String


type Message =
      DoNothing
    | PlayerRegistered GameId
    | ChoiceMade GameId
    | Resolve
    | NextGame GameId


emptyModel : GameId -> Model
emptyModel gameId =
    { history = [], current = emptyGameInfo gameId }


emptyGameInfo : GameId -> GameInfo
emptyGameInfo gameId =
    { gameId = gameId, registeredPlayers = 0, choicesMade = 0 }


update : Message -> Model -> (Model, Cmd Message)
update message model =
    case message of
        DoNothing -> (model, Cmd.none)

        PlayerRegistered gameId ->
           if gameId == model.current.gameId then
               ({ model | current = registerPlayer model.current }, Cmd.none)
           else
               (model, Cmd.none)

        ChoiceMade gameId ->
            if gameId == model.current.gameId then
                ({ model | current = registerChoice model.current }, Cmd.none)
            else
                (model, Cmd.none)

        Resolve ->
            (model, Cmd.none)

        NextGame gameId ->
            let
                history = model.current :: model.history

                current = emptyGameInfo gameId
            in
                ({ model | current = current, history = history }, Cmd.none)


registerPlayer : GameInfo -> GameInfo
registerPlayer gameInfo =
    { gameInfo | registeredPlayers = gameInfo.registeredPlayers + 1 }


registerChoice : GameInfo -> GameInfo
registerChoice gameInfo =
    { gameInfo | choicesMade = gameInfo.choicesMade + 1 }


view : Model -> Html.Html Message
view model =
    let
        currentView = [viewGameInfo model.current]

        historyView = List.map viewGameInfo model.history
    in
        Html.div
            []
            (List.concat [currentView, historyView])


viewGameInfo : GameInfo -> Html.Html Message
viewGameInfo gameInfo =
    Html.div
        []
        [
          Html.span [] [ Html.text ("id: " ++ (toString gameInfo.gameId)) ]
        , Html.span [] [ Html.text ("registered players: " ++ (toString gameInfo.registeredPlayers)) ]
        , Html.span [] [ Html.text ("choices made: " ++ (toString gameInfo.choicesMade)) ]
        , Html.button [ Event.onClick Resolve ] [ Html.text "resolve" ]
        ]


subscriptions : Model -> Sub Message
subscriptions _ = Sub.none
