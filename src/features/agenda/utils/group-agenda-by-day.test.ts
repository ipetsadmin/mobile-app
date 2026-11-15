import {
  makeAppointmentItem,
  makeBirthdayItem,
  makeDoseItem,
} from "@/test/factories/make-agenda-item"

import { groupAgendaByDay } from "./group-agenda-by-day"

const at = (day: number, hour: number) => new Date(2026, 5, day, hour)

describe("groupAgendaByDay", () => {
  it("returns no groups for an empty agenda", () => {
    expect(groupAgendaByDay([])).toEqual([])
  })

  it("puts items of the same day in a single group", () => {
    const morning = makeDoseItem({ occursAt: at(15, 8) })
    const evening = makeDoseItem({ occursAt: at(15, 20) })

    const groups = groupAgendaByDay([morning, evening])

    expect(groups).toHaveLength(1)
    expect(groups[0].items).toEqual([morning, evening])
    expect(groups[0].day).toEqual(morning.occursAt)
  })

  it("starts a new group when the day changes", () => {
    const first = makeDoseItem({ occursAt: at(15, 8) })
    const second = makeBirthdayItem({ occursAt: at(16, 0) })
    const third = makeAppointmentItem({ occursAt: at(16, 10) })

    const groups = groupAgendaByDay([first, second, third])

    expect(groups.map((group) => group.items)).toEqual([
      [first],
      [second, third],
    ])
  })

  it("does not mutate the received list", () => {
    const items = [makeDoseItem({ occursAt: at(15, 8) })]

    groupAgendaByDay(items)

    expect(items).toHaveLength(1)
  })
})
