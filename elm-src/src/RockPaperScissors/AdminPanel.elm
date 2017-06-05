module RockPaperScissors.AdminPanel exposing (main)


import Html
import Html.Attributes as Attribute
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
        currentView = [viewGameInfo True model.current]

        historyView = List.map (viewGameInfo False) model.history
    in
        Html.div
            []
            (List.concat [currentView, historyView])


viewGameInfo : Bool -> GameInfo -> Html.Html Message
viewGameInfo showButton gameInfo =
    Html.div
        [ Attribute.class "game" ]
        (List.concat
             [
               [
                 Html.span [ Attribute.class "id" ] [ Html.text ("id: " ++ gameInfo.gameId) ]
               , Html.span [ Attribute.classList
                                 [
                                  ("player", True)
                                 , ("count", True)
                                 ] ] [ Html.text ("players: " ++ (toString gameInfo.registeredPlayers)) ]
               , Html.span [Attribute.classList
                                [
                                 ("choices", True)
                                , ("count", True)
                                ] ] [ Html.text ("choices: " ++ (toString gameInfo.choicesMade)) ]
               ]
             , [
                 Html.button [
                      Attribute.classList
                          [
                           ("btn", True)
                          , ("btn-primary", True)
                          ]
                     , Event.onClick Resolve ] [ Html.text "resolve" ]
               ]
             ]
        )


subscriptions : Model -> Sub Message
subscriptions _ = Sub.none
